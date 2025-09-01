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
    <div className="min-h-screen bg-gray-50">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-2xl shadow-lg mb-8">
              <span className="text-2xl">✈️</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              ATPL Flight Planning
              <span className="block text-2xl md:text-3xl font-medium text-gray-600 mt-2">
                Study Platform
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Master ATPL flight planning with comprehensive practice questions, interactive calculations, and personalized learning paths.
            </p>
            
            {/* Stats overview */}
            {hasProgress && (
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-aviation-primary mb-1">{metrics.correctAnswers}</div>
                  <div className="text-sm font-medium text-gray-600">Correct</div>
                </div>
                <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{metrics.answeredQuestions}</div>
                  <div className="text-sm font-medium text-gray-600">Answered</div>
                </div>
                <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{metrics.accuracy.toFixed(0)}%</div>
                  <div className="text-sm font-medium text-gray-600">Accuracy</div>
                </div>
              </div>
            )}
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('questions')}
                className="inline-flex items-center px-8 py-4 bg-aviation-primary hover:bg-aviation-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-aviation-primary focus:ring-offset-2"
              >
                <span>Start Practicing</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              {!hasProgress && (
                <button
                  onClick={onShowAuthModal}
                  className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Questions Card */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-6 group-hover:bg-blue-100 transition-colors">
              <span className="text-xl">📚</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Questions</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Test your knowledge with comprehensive questions designed to mirror real exam conditions.
            </p>
            
            <div className="space-y-2 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                <span>{questions.length} practice questions</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                <span>Detailed explanations</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                <span>Progress tracking</span>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate('questions')}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Questions
            </button>
          </div>

          {/* Flight Plan Card */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl mb-6 group-hover:bg-green-100 transition-colors">
              <span className="text-xl">🛩️</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Flight Planning</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Practice real-world flight planning calculations with interactive tools.
            </p>
            
            <div className="space-y-2 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                <span>Manual calculations</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                <span>Weight & balance</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                <span>Export capabilities</span>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate('flightplan')}
              className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Open Flight Plan
            </button>
          </div>

          {/* Notes Card */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl mb-6 group-hover:bg-purple-100 transition-colors">
              <span className="text-xl">📝</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Course Notes</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Access course materials and build your personal knowledge base with OCR.
            </p>
            
            <div className="space-y-2 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                <span>PDF materials</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                <span>OCR text extraction</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                <span>Personal notes</span>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate('notes')}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              View Notes
            </button>
          </div>
        </div>

        {/* Progressive Disclosure: Detailed Stats */}
        {hasProgress && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-16">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
                  <p className="text-sm text-gray-600 mt-1">Detailed breakdown by topic area</p>
                </div>
                <button
                  onClick={() => setShowDetailedStats(!showDetailedStats)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-lg"
                >
                  {showDetailedStats ? 'Hide Details' : 'Show Details'}
                  <svg 
                    className={`ml-2 w-4 h-4 transition-transform ${showDetailedStats ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {showDetailedStats && (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(questionCategories).map(([categoryKey, categoryName]) => {
                    const category = categoryKey as QuestionCategory;
                    const stats = categoryPerformance[category];
                    const questionsInCategory = questions.filter(q => q.category === category).length;
                    const hasData = stats.attempted > 0;
                    
                    return (
                      <div key={categoryKey} className="p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">{categoryName}</h3>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                            {questionsInCategory} total
                          </span>
                        </div>
                        
                        {hasData ? (
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Attempted</span>
                              <span className="font-medium">{stats.attempted}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Correct</span>
                              <span className="font-medium text-green-600">{stats.correct}</span>
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
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-gray-400 text-sm mb-2">Not started yet</div>
                            <button 
                              onClick={() => onNavigate('questions')}
                              className="text-xs text-aviation-primary hover:text-aviation-secondary font-medium transition-colors"
                            >
                              Start practicing →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity - Only show if there's activity */}
        {userAnswers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600 mt-1">Your latest practice sessions</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                {userAnswers.slice(-3).reverse().map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  const categoryName = question?.category ? questionCategories[question.category] : 'Unknown';
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {question?.title || 'Unknown Question'}
                          </div>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-500">
                              {Math.round(answer.timeSpent)}s
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-md ${
                              answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {answer.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                              {categoryName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(answer.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MenuScreen;