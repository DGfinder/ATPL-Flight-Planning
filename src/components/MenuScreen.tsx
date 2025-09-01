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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm relative`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {!sidebarCollapsed ? (
                <img 
                  src="/favicon.png" 
                  alt="Aviation Theory Services"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to emoji if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
              )}
              {/* Fallback emoji (hidden by default) */}
              <div className="w-8 h-8 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-lg items-center justify-center shadow-sm hidden">
                <span className="text-sm">✈️</span>
              </div>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-sm font-bold text-gray-900">ATPL Flight Planning</h1>
                <p className="text-xs text-gray-500">Aviation Theory Services</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-2">
          <div className="relative">
            <button className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl bg-gradient-to-r from-aviation-primary to-aviation-secondary text-white shadow-lg transform scale-105 transition-all duration-200">
              <span className="text-lg">🏠</span>
              {!sidebarCollapsed && <span className="font-semibold text-sm">Dashboard</span>}
            </button>
          </div>

          <button 
            onClick={() => onNavigate('questions')}
            className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl text-gray-700 hover:bg-blue-50 hover:text-aviation-primary transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">📚</span>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <span className="font-medium text-sm">Practice Questions</span>
                <div className="text-xs text-gray-500">{questions.length} available</div>
              </div>
            )}
          </button>

          <button 
            onClick={() => onNavigate('flightplan')}
            className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🛩️</span>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <span className="font-medium text-sm">Flight Planning</span>
                <div className="text-xs text-gray-500">Interactive tools</div>
              </div>
            )}
          </button>

          <button 
            onClick={() => onNavigate('notes')}
            className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">📝</span>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <span className="font-medium text-sm">Course Notes</span>
                <div className="text-xs text-gray-500">Study materials</div>
              </div>
            )}
          </button>

          {hasProgress && (
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 group">
                <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                {!sidebarCollapsed && (
                  <div className="flex-1">
                    <span className="font-medium text-sm">Analytics</span>
                    <div className="text-xs text-gray-500">Performance data</div>
                  </div>
                )}
              </button>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-100">
          {hasProgress ? (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3">
              {!sidebarCollapsed ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Your Progress</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-aviation-primary">{metrics.correctAnswers}</div>
                      <div className="text-xs text-gray-600">Correct</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{metrics.answeredQuestions}</div>
                      <div className="text-xs text-gray-600">Answered</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{metrics.accuracy.toFixed(0)}%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-bold text-aviation-primary">{metrics.correctAnswers}</div>
                  <div className="text-xs text-gray-600">Correct</div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onShowAuthModal}
              className="w-full bg-gradient-to-r from-aviation-primary to-aviation-secondary text-white rounded-xl py-3 px-4 text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {sidebarCollapsed ? '🔐' : '🔐 Sign In'}
            </button>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 hover:text-aviation-primary"
        >
          <svg className={`w-3 h-3 transform transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Beautiful Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-aviation-primary via-aviation-secondary to-blue-800">
          {/* Background Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            opacity: 0.3
          }}></div>

          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Welcome Message */}
              <div>
                <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
                  Welcome to Aviation Theory Services
                </h1>
                <p className="text-blue-100 text-sm">
                  {hasProgress ? 
                    `You've answered ${metrics.answeredQuestions} questions with ${metrics.accuracy.toFixed(0)}% accuracy` :
                    'Professional ATPL flight planning training platform'
                  }
                </p>
              </div>

              {/* Header Stats */}
              {hasProgress && (
                <div className="hidden md:flex items-center space-x-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{metrics.correctAnswers}</div>
                      <div className="text-xs text-blue-100">Questions Correct</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{metrics.accuracy.toFixed(0)}%</div>
                      <div className="text-xs text-blue-100">Accuracy Rate</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{Object.keys(questionCategories).length}</div>
                      <div className="text-xs text-blue-100">Study Areas</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('questions')}
                  className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-6 py-3 rounded-xl text-sm font-semibold border border-white/20 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Start Practicing
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Questions Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                   onClick={() => onNavigate('questions')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">📚</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Questions</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Comprehensive practice questions designed to mirror real ATPL exam conditions with detailed explanations.
                </p>
                {hasProgress && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-aviation-primary">
                      {metrics.answeredQuestions}/{questions.length} answered
                    </span>
                  </div>
                )}
              </div>

              {/* Flight Planning Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                   onClick={() => onNavigate('flightplan')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">🛩️</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">∞</div>
                    <div className="text-xs text-gray-500">Scenarios</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Flight Planning</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Interactive flight planning worksheets with real-world calculations for weight, balance, and performance.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tools Available</span>
                  <span className="font-semibold text-green-600">Calculator, Charts</span>
                </div>
              </div>

              {/* Notes Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                   onClick={() => onNavigate('notes')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">📝</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-xs text-gray-500">PDFs</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Notes</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Access comprehensive study materials and use OCR to digitize your own notes and references.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">OCR Available</span>
                  <span className="font-semibold text-purple-600">Text Extraction</span>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            {hasProgress && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Study Progress</h2>
                    <p className="text-gray-600 text-sm">Your performance across different topic areas</p>
                  </div>
                  <button
                    onClick={() => setShowDetailedStats(!showDetailedStats)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    {showDetailedStats ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(questionCategories).map(([categoryKey, categoryName]) => {
                    const category = categoryKey as QuestionCategory;
                    const stats = categoryPerformance[category];
                    const questionsInCategory = questions.filter(q => q.category === category).length;
                    
                    return (
                      <div key={categoryKey} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900 text-sm">{categoryName}</h3>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                            {questionsInCategory} total
                          </span>
                        </div>
                        
                        {stats.attempted > 0 ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{stats.attempted}/{questionsInCategory}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${stats.accuracy >= 80 ? 'bg-green-500' : stats.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Accuracy</span>
                              <span className={`font-medium ${stats.accuracy >= 80 ? 'text-green-600' : stats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {stats.accuracy.toFixed(1)}%
                              </span>
                            </div>
                            
                            {showDetailedStats && (
                              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                  <span>Correct:</span>
                                  <span className="text-green-600 font-medium">{stats.correct}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Incorrect:</span>
                                  <span className="text-red-600 font-medium">{stats.attempted - stats.correct}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <div className="text-gray-400 text-sm mb-2">Not started</div>
                            <button 
                              onClick={() => onNavigate('questions')}
                              className="text-xs text-aviation-primary hover:text-aviation-secondary font-medium"
                            >
                              Begin studying →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {hasProgress && userAnswers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {userAnswers.slice(-5).reverse().map((answer, index) => {
                    const question = questions.find(q => q.id === answer.questionId);
                    const categoryName = question?.category ? questionCategories[question.category] : 'Unknown';
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                        <div className={`w-2 h-2 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {question?.title || 'Unknown Question'}
                          </div>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-500">{Math.round(answer.timeSpent)}s</span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {answer.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                              {categoryName}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(answer.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Getting Started */}
            {!hasProgress && (
              <div className="bg-gradient-to-br from-aviation-primary via-aviation-secondary to-blue-800 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
                }}></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Ready to Begin Your ATPL Journey?</h2>
                  <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                    Start with practice questions to build your knowledge, then move on to flight planning exercises and course materials.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => onNavigate('questions')}
                      className="bg-white text-aviation-primary font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                    >
                      Start with Questions
                    </button>
                    <button
                      onClick={onShowAuthModal}
                      className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-aviation-primary transition-colors duration-300"
                    >
                      Sign In for Progress
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuScreen;