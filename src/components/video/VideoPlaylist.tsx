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
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
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
              <div className="w-10 h-10 bg-aviation-primary text-white rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
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
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Total duration: {formatDuration(getTotalDuration())}</span>
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
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-aviation-primary/5 hover:to-blue-50 transition-all duration-300 group ${
                      isActive ? 'bg-gradient-to-r from-aviation-primary/10 to-blue-50 border-l-4 border-l-aviation-primary shadow-md' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Video thumbnail */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://img.youtube.com/vi/${video.youtubeId}/default.jpg`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          {/* Status indicator */}
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            isWatched
                              ? 'bg-green-500 text-white'
                              : isActive
                              ? 'bg-aviation-primary text-white'
                              : 'bg-gray-400 text-white'
                          }`}>
                            {isWatched ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Video info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm leading-tight mb-1 ${
                          isActive ? 'text-aviation-primary' : 'text-gray-900 group-hover:text-aviation-primary'
                        } transition-colors`}>
                          {video.title}
                        </h4>
                        <p className={`text-xs leading-relaxed line-clamp-2 mb-2 ${
                          isActive ? 'text-aviation-primary/80' : 'text-gray-600'
                        }`}>
                          {video.description}
                        </p>
                        <div className={`flex items-center space-x-3 text-xs ${
                          isActive ? 'text-aviation-primary/60' : 'text-gray-500'
                        }`}>
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatDuration(video.duration)}</span>
                          </span>
                          {video.subtopics && video.subtopics.length > 0 && (
                            <span className="flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span>{video.subtopics.length} topics</span>
                            </span>
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