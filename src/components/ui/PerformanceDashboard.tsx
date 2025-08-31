import React from 'react';
import type { PerformanceMetrics, QuestionCategory } from '../../types';
import { questionCategories } from '../../data/questions';

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
  onClose: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  metrics,
  onClose
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy: number): string => {
    if (accuracy >= 80) return 'bg-green-100';
    if (accuracy >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="aviation-card max-w-4xl max-h-96 overflow-y-auto p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-aviation-primary">Performance Analytics</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="aviation-card p-4 text-center">
            <div className="text-2xl font-bold text-aviation-primary">
              {metrics.answeredQuestions}
            </div>
            <div className="text-sm text-gray-600">Questions Answered</div>
            <div className="text-xs text-gray-500 mt-1">
              of {metrics.totalQuestions} total
            </div>
          </div>

          <div className="aviation-card p-4 text-center">
            <div className={`text-2xl font-bold ${getAccuracyColor(metrics.accuracy)}`}>
              {metrics.accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Overall Accuracy</div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.correctAnswers} correct
            </div>
          </div>

          <div className="aviation-card p-4 text-center">
            <div className="text-2xl font-bold text-aviation-primary">
              {formatTime(metrics.averageTimePerQuestion)}
            </div>
            <div className="text-sm text-gray-600">Avg Time/Question</div>
          </div>

          <div className="aviation-card p-4 text-center">
            <div className="text-2xl font-bold text-aviation-primary">
              {Math.round((metrics.answeredQuestions / metrics.totalQuestions) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-aviation-primary h-2 rounded-full"
                style={{ width: `${(metrics.answeredQuestions / metrics.totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Category Performance</h3>
          <div className="space-y-3">
            {Object.entries(questionCategories).map(([categoryKey, categoryName]) => {
              const category = categoryKey as QuestionCategory;
              const performance = metrics.categoryPerformance[category];
              
              if (performance.attempted === 0) return null;
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800">{categoryName}</div>
                    <div className="text-sm text-gray-600">
                      {performance.attempted} questions attempted
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded ${getAccuracyBgColor(performance.accuracy)}`}>
                      <span className={`font-bold ${getAccuracyColor(performance.accuracy)}`}>
                        {performance.accuracy.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {performance.correct}/{performance.attempted}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Performance calculated from your current session
          </div>
          <button 
            onClick={onClose}
            className="aviation-button"
          >
            Continue Studying
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;