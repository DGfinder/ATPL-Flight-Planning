import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question, UserAnswer, QuestionCategory, PerformanceMetrics } from '../types';
import { sampleQuestions, questionCategories } from '../data/questions';
import { storageService } from '../utils/localStorage';
import { databaseService } from '../services/database';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Core state
  const [questions] = useState<Question[]>(sampleQuestions);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // Session progress
  // Removed unused sessionProgress state


  const sessionMetrics = useMemo((): PerformanceMetrics => {
    const answeredQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    const averageTimePerQuestion = answeredQuestions > 0 
      ? userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / answeredQuestions / 1000 
      : 0;

    // Category breakdown
    const categoryPerformance: Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }> = {} as Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }>;
    
    Object.keys(questionCategories).forEach(cat => {
      const category = cat as QuestionCategory;
      const categoryAnswers = userAnswers.filter(a => {
        const question = questions.find(q => q.id === a.questionId);
        return question?.category === category;
      });
      
      const attempted = categoryAnswers.length;
      const correct = categoryAnswers.filter(a => a.isCorrect).length;
      const categoryAccuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      
      categoryPerformance[category] = { attempted, correct, accuracy: categoryAccuracy };
    });

    return {
      totalQuestions: questions.length,
      answeredQuestions,
      correctAnswers,
      accuracy,
      averageTimePerQuestion,
      categoryPerformance
    };
  }, [userAnswers, questions]);

  // Load user progress on component mount
  useEffect(() => {
    const loadUserProgress = async () => {
      if (user) {
        try {
          // Load from database for authenticated users
          const progress = await databaseService.getUserProgress();
          if (progress) {
            setUserAnswers(progress);
          }
        } catch (error) {
          console.error('Failed to load user progress from database:', error);
          // Fallback to localStorage
          const localProgress = storageService.loadUserAnswers();
          setUserAnswers(localProgress);
        }
      } else {
        // Load from localStorage for unauthenticated users
        const localProgress = storageService.loadUserAnswers();
        setUserAnswers(localProgress);
      }
    };

    loadUserProgress();
  }, [user]);

  const hasProgress = userAnswers.length > 0;

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-aviation-navy to-aviation-primary rounded-xl p-6 text-white text-center">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome to ATPL Training Platform
        </h1>
        <p className="text-white/80">
          {user ? `Welcome back, ${user.email}` : 'Master aviation theory with confidence'}
        </p>
      </div>

      {/* Progress Overview */}
      {hasProgress && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Study Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-aviation-primary">{sessionMetrics.answeredQuestions}</div>
                <div className="text-sm text-slate-600">Questions Attempted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-aviation-secondary">{sessionMetrics.correctAnswers}</div>
                <div className="text-sm text-slate-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-aviation-navy">{Math.round(sessionMetrics.accuracy)}%</div>
                <div className="text-sm text-slate-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{Math.round(sessionMetrics.averageTimePerQuestion)}s</div>
                <div className="text-sm text-slate-600">Avg. Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Course Notes */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/notes')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Course Notes</h3>
          <p className="text-slate-600 text-sm mb-4">Access comprehensive ATPL theory notes and study materials.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>Start Reading</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Practice Questions */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/questions')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Practice Questions</h3>
          <p className="text-slate-600 text-sm mb-4">Test your knowledge with practice questions across all categories.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>Start Practice</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Trial Exam */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/exam')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-secondary/10 to-aviation-secondary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-secondary/20 group-hover:to-aviation-secondary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Trial Exam</h3>
          <p className="text-slate-600 text-sm mb-4">Take a timed trial exam to simulate real exam conditions.</p>
          <div className="flex items-center text-aviation-secondary text-sm font-medium">
            <span>Start Exam</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Flight Planning */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/flight-plan')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Flight Planning</h3>
          <p className="text-slate-600 text-sm mb-4">Practice flight planning calculations and route optimization.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>Start Planning</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Analytics */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/analytics')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance Analytics</h3>
          <p className="text-slate-600 text-sm mb-4">Review detailed analytics and track your learning progress.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>View Analytics</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {hasProgress && (
        <div className="aviation-card p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {userAnswers.slice(-5).reverse().map((answer, index) => {
              const question = questions.find(q => q.id === answer.questionId);
              if (!question) return null;
              
              return (
                <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white rounded-xl border border-slate-100 hover:border-aviation-primary/20 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${
                      answer.isCorrect 
                        ? 'bg-gradient-to-br from-aviation-secondary/10 to-aviation-secondary/5' 
                        : 'bg-gradient-to-br from-red-50 to-red-25'
                    }`}>
                      {answer.isCorrect ? (
                        <svg className="w-4 h-4 text-aviation-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {question.title}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {question.category.replace('_', ' ')} • {Math.round(answer.timeSpent / 1000)}s
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    answer.isCorrect 
                      ? 'bg-aviation-secondary/10 text-aviation-secondary' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;