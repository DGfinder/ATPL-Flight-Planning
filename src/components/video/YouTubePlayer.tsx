import React, { useState, useRef } from 'react';
import type { AtplVideo } from '../../types';

interface YouTubePlayerProps {
  video: AtplVideo;
  autoplay?: boolean;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  video, 
  autoplay = false,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Build YouTube embed URL
  const getEmbedUrl = (): string => {
    const baseUrl = `https://www.youtube.com/embed/${video.youtubeId}`;
    const params = new URLSearchParams({
      rel: '0', // Don't show related videos from other channels
      modestbranding: '1', // Use modest branding
      showinfo: '0', // Don't show video title and uploader
      iv_load_policy: '3', // Don't show annotations
      enablejsapi: '1', // Enable JavaScript API
      origin: window.location.origin
    });

    if (autoplay) {
      params.append('autoplay', '1');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const handleIframeLoad = () => {
    setIsLoaded(true);
    setError(null);
  };

  const handleIframeError = () => {
    setError('Failed to load video. Please check your internet connection.');
    setIsLoaded(false);
  };

  // Get YouTube thumbnail URL
  const getThumbnailUrl = (quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string => {
    return `https://img.youtube.com/vi/${video.youtubeId}/${quality}default.jpg`;
  };

  return (
    <div className={`youtube-player ${className}`}>
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
        {/* Video container with 16:9 aspect ratio */}
        <div className="relative aspect-video">
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center space-y-4">
                {/* Thumbnail preview */}
                <div className="relative">
                  <img
                    src={video.thumbnail || getThumbnailUrl('high')}
                    alt={video.title}
                    className="w-32 h-18 object-cover rounded"
                    onError={(e) => {
                      // Fallback to standard quality thumbnail
                      const target = e.target as HTMLImageElement;
                      if (target.src !== getThumbnailUrl('default')) {
                        target.src = getThumbnailUrl('default');
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                      ▶️
                    </div>
                  </div>
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-600 text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-center">
                <div className="text-red-400 text-4xl mb-2">⚠️</div>
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    if (iframeRef.current) {
                      iframeRef.current.src = getEmbedUrl();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={getEmbedUrl()}
            title={video.title}
            className={`absolute inset-0 w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>

        {/* Video controls and info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="text-white">
            <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>⏱️ {formatDuration(video.duration)}</span>
              {video.subtopics && video.subtopics.length > 0 && (
                <span>📚 {video.subtopics.length} topics</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video description and metadata */}
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-gray-700 text-sm leading-relaxed">{video.description}</p>
        </div>

        {/* Subtopics */}
        {video.subtopics && video.subtopics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Topics covered:</h4>
            <div className="flex flex-wrap gap-2">
              {video.subtopics.map((subtopic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {subtopic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <span>🔗</span>
              <span>Open in YouTube</span>
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Duration: {formatDuration(video.duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;