import React from 'react';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-aviation-primary/10 via-aviation-secondary/10 to-blue-600/10"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-2xl shadow-xl mb-8">
              <span className="text-3xl">✈️</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-aviation-primary to-aviation-secondary">ATPL Flight Planning</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive study tool for ATPL flight planning exams. Master the fundamentals with interactive practice, real-world calculations, and personalized learning.
            </p>
            
            {/* Quick Stats Banner */}
            <div className="mt-12 inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-aviation-primary">{questions.length}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Object.keys(questionCategories).length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practice Questions Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-aviation-primary/20 to-aviation-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-2xl">📚</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Practice Questions</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Test your knowledge with comprehensive multiple choice and short answer questions designed to mirror real exam conditions.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Adaptive difficulty system</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Detailed explanations & working steps</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Performance analytics & progress tracking</span>
                </div>
              </div>
              
              <button
                onClick={() => onNavigate('questions')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Practicing
              </button>
            </div>
          </div>

          {/* Flight Planning Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-2xl">🛩️</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Flight Planning Sheet</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Master real-world flight planning with interactive calculations, manual entry for learning, and professional-grade tools.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Manual GS & ETI calculations</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Advanced weight & balance</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Export to professional formats</span>
                </div>
              </div>
              
              <button
                onClick={() => onNavigate('flightplan')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Open Flight Plan
              </button>
            </div>
          </div>

          {/* Course Notes Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Notes</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access comprehensive course materials, import your own notes via OCR, and build your personal knowledge base.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">PDF course materials</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Advanced OCR text extraction</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Personal note organization</span>
                </div>
              </div>
              
              <button
                onClick={() => onNavigate('notes')}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                View Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      {userAnswers.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600 mt-1">Your latest study sessions and progress</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                {userAnswers.slice(-5).reverse().map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="font-semibold text-gray-900">{question?.title || 'Unknown Question'}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-4">
                            <span>⏱️ {Math.round(answer.timeSpent)}s</span>
                            <span>📊 {answer.isCorrect ? 'Correct' : 'Incorrect'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(answer.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-aviation-primary to-aviation-secondary rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">Ready to Excel in ATPL Flight Planning?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join ATPL Theory Students across Australia who have successfully passed their ATPL exams using our comprehensive training platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('questions')}
                className="bg-white text-aviation-primary font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                Begin Training
              </button>
              <button
                onClick={onShowAuthModal}
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-aviation-primary transition-colors duration-300"
              >
                Access Platform
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
