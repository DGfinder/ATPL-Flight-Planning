import React, { useState } from 'react';
import YouTubePlayer from './YouTubePlayer';
import type { AtplVideo } from '../../types';

interface VideoPlaylistProps {
  videos: AtplVideo[];
  title?: string;
  autoplayNext?: boolean;
  className?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
  videos,
  title = 'Video Lessons',
  autoplayNext = false,
  className = ''
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos] = useState<Set<string>>(new Set());

  // Sort videos by order
  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);
  const currentVideo = sortedVideos[currentVideoIndex];


  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (): number => {
    return sortedVideos.reduce((total, video) => total + video.duration, 0);
  };

  const getWatchProgress = (): number => {
    return sortedVideos.length > 0 ? (watchedVideos.size / sortedVideos.length) * 100 : 0;
  };

  if (sortedVideos.length === 0) {
    return (
      <div className={`video-playlist ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos available</h3>
          <p className="text-gray-600">Video lessons will be added soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-playlist ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video player */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            {currentVideo && (
              <YouTubePlayer
                video={currentVideo}
                autoplay={false}
              />
            )}
          </div>
        </div>

        {/* Playlist sidebar */}
        <div className="space-y-6">
          {/* Playlist header */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">🎥</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">{sortedVideos.length} videos</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{watchedVideos.size}/{sortedVideos.length} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getWatchProgress()}%` }}
                />
              </div>
            </div>

            {/* Total duration */}
            <div className="text-sm text-gray-600">
              <span>⏱️ Total duration: {formatDuration(getTotalDuration())}</span>
            </div>
          </div>

          {/* Video list */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Lesson List</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {sortedVideos.map((video, index) => {
                const isActive = index === currentVideoIndex;
                const isWatched = watchedVideos.has(video.id);

                return (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(index)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Video thumbnail/indicator */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          isWatched
                            ? 'bg-green-100 text-green-700'
                            : isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isWatched ? '✓' : index + 1}
                        </div>
                      </div>

                      {/* Video info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate ${
                          isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {video.title}
                        </h4>
                        <p className={`text-xs mt-1 line-clamp-2 ${
                          isActive ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {video.description}
                        </p>
                        <div className={`flex items-center space-x-3 mt-2 text-xs ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          <span>⏱️ {formatDuration(video.duration)}</span>
                          {video.subtopics && video.subtopics.length > 0 && (
                            <span>📚 {video.subtopics.length} topics</span>
                          )}
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex-shrink-0">
                        {isActive && (
                          <div className="text-blue-500 text-xs">▶️</div>
                        )}
                        {isWatched && !isActive && (
                          <div className="text-green-500 text-xs">✅</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playlist controls */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Playlist Controls</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentVideoIndex(Math.max(0, currentVideoIndex - 1))}
                disabled={currentVideoIndex === 0}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ⏮️ Previous Video
              </button>
              <button
                onClick={() => setCurrentVideoIndex(Math.min(sortedVideos.length - 1, currentVideoIndex + 1))}
                disabled={currentVideoIndex === sortedVideos.length - 1}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Video ⏭️
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={autoplayNext}
                  onChange={(e) => {
                    // This would need to be passed as a prop or managed by parent
                    console.log('Autoplay toggled:', e.target.checked);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Auto-play next video</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaylist;