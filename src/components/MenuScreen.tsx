import React, { useState } from 'react';
import type { Question, UserAnswer, QuestionCategory, PerformanceMetrics } from '../types';
import { questionCategories } from '../data/questions';

interface MenuScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  metrics: PerformanceMetrics;
  onNavigate: (view: 'questions' | 'flightplan' | 'notes') => void;
  onShowAuthModal: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  questions,
  userAnswers,
  metrics,
  onNavigate,
  onShowAuthModal
}) => {
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  // Calculate category performance
  const calculateCategoryPerformance = () => {
    const categoryStats: Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }> = {} as Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }>;
    
    Object.keys(questionCategories).forEach(cat => {
      const category = cat as QuestionCategory;
      const categoryAnswers = userAnswers.filter(a => {
        const question = questions.find(q => q.id === a.questionId);
        return question?.category === category;
      });
      
      const attempted = categoryAnswers.length;
      const correct = categoryAnswers.filter(a => a.isCorrect).length;
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      
      categoryStats[category] = { attempted, correct, accuracy };
    });
    
    return categoryStats;
  };

  const categoryPerformance = calculateCategoryPerformance();
  const hasProgress = userAnswers.length > 0;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Compact Header Bar */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-lg flex items-center justify-center">
              <span className="text-sm">✈️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ATPL Flight Planning</h1>
              <p className="text-xs text-gray-500">Study Platform</p>
            </div>
          </div>

          {/* Inline Stats */}
          {hasProgress ? (
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-aviation-primary">{metrics.correctAnswers}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{metrics.answeredQuestions}</div>
                <div className="text-xs text-gray-600">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{metrics.accuracy.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
            </div>
          ) : (
            <button
              onClick={onShowAuthModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 flex min-h-0">
        {/* Left Column - Feature Cards */}
        <div className="flex-1 p-4">
          <div className="h-full flex flex-col">
            {/* Welcome Message */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back!</h2>
              <p className="text-sm text-gray-600">Choose your study approach below</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Questions Card */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Practice Questions</h3>
                    <p className="text-xs text-gray-600">{questions.length} questions available</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">Test your knowledge with comprehensive practice questions</p>
                <button
                  onClick={() => onNavigate('questions')}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  Start Questions
                </button>
              </div>

              {/* Flight Planning Card */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🛩️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Flight Planning</h3>
                    <p className="text-xs text-gray-600">Interactive calculations</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">Practice real-world flight planning calculations</p>
                <button
                  onClick={() => onNavigate('flightplan')}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  Open Flight Plan
                </button>
              </div>

              {/* Notes Card */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Course Notes</h3>
                    <p className="text-xs text-gray-600">Study materials & OCR</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">Access course materials and build knowledge base</p>
                <button
                  onClick={() => onNavigate('notes')}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  View Notes
                </button>
              </div>
            </div>

            {/* Recent Activity (if exists) */}
            {hasProgress && userAnswers.length > 0 && (
              <div className="flex-1 bg-white rounded-xl border border-gray-200 min-h-0">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
                </div>
                <div className="p-4 space-y-2 overflow-auto">
                  {userAnswers.slice(-5).reverse().map((answer, index) => {
                    const question = questions.find(q => q.id === answer.questionId);
                    const categoryName = question?.category ? questionCategories[question.category] : 'Unknown';
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-xs truncate">
                              {question?.title || 'Unknown Question'}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{Math.round(answer.timeSpent)}s</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {answer.isCorrect ? 'Correct' : 'Wrong'}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {categoryName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Progress Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">Progress Overview</h3>
            
            {hasProgress ? (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Overall Progress</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{metrics.answeredQuestions} / {questions.length}</span>
                    <span className="text-gray-600">{((metrics.answeredQuestions / questions.length) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-aviation-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${(metrics.answeredQuestions / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Categories</span>
                    <button
                      onClick={() => setShowDetailedStats(!showDetailedStats)}
                      className="text-xs text-aviation-primary hover:text-aviation-secondary"
                    >
                      {showDetailedStats ? 'Hide' : 'Details'}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(questionCategories).map(([categoryKey, categoryName]) => {
                      const category = categoryKey as QuestionCategory;
                      const stats = categoryPerformance[category];
                      const questionsInCategory = questions.filter(q => q.category === category).length;
                      
                      return (
                        <div key={categoryKey} className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700 truncate">{categoryName}</span>
                            {stats.attempted > 0 ? (
                              <span className={`font-medium ${stats.accuracy >= 80 ? 'text-green-600' : stats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {stats.accuracy.toFixed(0)}%
                              </span>
                            ) : (
                              <span className="text-gray-400">Not started</span>
                            )}
                          </div>
                          
                          {stats.attempted > 0 && (
                            <>
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full ${stats.accuracy >= 80 ? 'bg-green-500' : stats.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                                ></div>
                              </div>
                              
                              {showDetailedStats && (
                                <div className="mt-2 text-xs text-gray-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Attempted:</span>
                                    <span>{stats.attempted} / {questionsInCategory}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Correct:</span>
                                    <span className="text-green-600">{stats.correct}</span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">🚀</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Start practicing to track your progress</p>
                <button
                  onClick={() => onNavigate('questions')}
                  className="text-sm text-aviation-primary hover:text-aviation-secondary font-medium"
                >
                  Begin your journey →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            ATPL Flight Planning Study Platform
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onNavigate('questions')}
              className="px-6 py-2 bg-aviation-primary hover:bg-aviation-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Start Practicing
            </button>
            {!hasProgress && (
              <button
                onClick={onShowAuthModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuScreen;