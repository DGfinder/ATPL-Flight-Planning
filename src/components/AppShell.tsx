import React, { useState, useEffect, useMemo } from 'react';
import type { Question, UserAnswer, SessionProgress, StudyMode, QuestionCategory, PerformanceMetrics } from '../types';
import { sampleQuestions, questionCategories } from '../data/questions';
import { storageService } from '../utils/localStorage';
import { databaseService } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import QuestionDisplay from './questions/QuestionDisplay';
import PerformanceDashboard from './ui/PerformanceDashboard';
import SettingsPanel from './ui/SettingsPanel';
import FlightPlanTable from './flight-plan/FlightPlanTable';
import CourseNotes from './notes/CourseNotes';
import AuthModal from './auth/AuthModal';
import Calculator from './ui/Calculator';
import LegendPopover from './ui/LegendPopover';

const AppShell: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  
  // Core state
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>('practice');
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionStartTime] = useState<Date>(new Date());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // UI state
  const [currentView, setCurrentView] = useState<'dashboard' | 'notes' | 'questions' | 'exam' | 'flightplan' | 'analytics'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Session progress
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    currentQuestionIndex: 0,
    answeredQuestions: new Set(),
    correctAnswers: new Set(),
    userAnswers: [],
    startTime: sessionStartTime,
    studyMode: 'practice'
  });

  const filteredQuestions = useMemo(() => {
    if (categoryFilter === 'all') return questions;
    return questions.filter(q => q.category === categoryFilter);
  }, [questions, categoryFilter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Calculate performance metrics
  const calculatePerformanceMetrics = (): PerformanceMetrics => {
    const totalQuestions = questions.length;
    const answeredQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    const totalTime = userAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTimePerQuestion = answeredQuestions > 0 ? totalTime / answeredQuestions : 0;

    const categoryPerformance: Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }> = {} as Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }>;
    
    Object.keys(questionCategories).forEach(cat => {
      const category = cat as QuestionCategory;
      const categoryAnswers = userAnswers.filter(a => {
        const question = questions.find(q => q.id === a.questionId);
        return question?.category === category;
      });
      
      const attempted = categoryAnswers.length;
      const correct = categoryAnswers.filter(a => a.isCorrect).length;
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      
      categoryPerformance[category] = { attempted, correct, accuracy };
    });

    return {
      totalQuestions,
      answeredQuestions, 
      correctAnswers,
      accuracy,
      averageTimePerQuestion,
      categoryPerformance
    };
  };

  const metrics = calculatePerformanceMetrics();
  const hasProgress = userAnswers.length > 0;

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user) {
          // Load from Supabase
          const [dbQuestions, dbAnswers] = await Promise.all([
            databaseService.getAllQuestions(),
            databaseService.getUserProgress()
          ]);
          
          // Use database questions if available, fallback to sample
          if (dbQuestions.length > 0) {
            setQuestions(dbQuestions);
          }
          
          setUserAnswers(dbAnswers);
          
          // Create new study session
          const sessionId = await databaseService.createStudySession('practice');
          setCurrentSessionId(sessionId);
        } else {
          // Fallback to localStorage
          const savedProgress = storageService.loadSessionProgress();
          const savedAnswers = storageService.loadUserAnswers();
          
          if (savedProgress) {
            setSessionProgress(savedProgress);
            setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
            setStudyMode(savedProgress.studyMode);
            setCategoryFilter(savedProgress.categoryFilter || 'all');
          }
          
          if (savedAnswers.length > 0) {
            setUserAnswers(savedAnswers);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to localStorage on error
        const savedAnswers = storageService.loadUserAnswers();
        setUserAnswers(savedAnswers);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading]);

  // Update session progress
  useEffect(() => {
    const progress: SessionProgress = {
      currentQuestionIndex,
      answeredQuestions: new Set(userAnswers.map(a => a.questionId)),
      correctAnswers: new Set(userAnswers.filter(a => a.isCorrect).map(a => a.questionId)),
      userAnswers,
      startTime: sessionStartTime,
      categoryFilter: categoryFilter === 'all' ? undefined : categoryFilter,
      studyMode,
      examEndTime: sessionProgress.examEndTime
    };
    
    setSessionProgress(progress);
    
    // Save to localStorage as backup
    storageService.saveSessionProgress(progress);
  }, [currentQuestionIndex, userAnswers, categoryFilter, studyMode, sessionStartTime]);

  // Auto-collapse sidebar for flight plan
  useEffect(() => {
    if (currentView === 'flightplan' && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [currentView]);

  // Handle answer submission
  const handleAnswerSubmit = async (answer: UserAnswer) => {
    const updatedAnswers = [
      ...userAnswers.filter(a => a.questionId !== answer.questionId),
      answer
    ];
    
    setUserAnswers(updatedAnswers);
    
    try {
      if (user) {
        // Save to Supabase
        await databaseService.saveUserAnswer(answer);
        
        // Update current study session
        if (currentSessionId) {
          const correctCount = updatedAnswers.filter(a => a.isCorrect).length;
          await databaseService.updateStudySession(currentSessionId, updatedAnswers.length, correctCount);
        }
      } else {
        // Fallback to localStorage
        storageService.saveUserAnswers(updatedAnswers);
      }
    } catch (error) {
      console.error('Failed to save answer:', error);
      // Always save to localStorage as backup
      storageService.saveUserAnswers(updatedAnswers);
    }
    
    if (studyMode === 'practice' && storageService.loadSettings().autoAdvanceOnCorrect && answer.isCorrect) {
      setTimeout(() => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 2000);
    }
  };

  const handleAuthSuccess = () => {
    window.location.reload();
  };


  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-slate-700 mb-2">Loading Aviation Theory Services</div>
          <div className="text-sm text-slate-500">Preparing your study environment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Professional Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm z-30`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.webp" 
              alt="Aviation Theory Services"
              className={`${sidebarCollapsed ? 'h-8' : 'h-10'} w-auto object-contain transition-all duration-300`}
            />
            {!sidebarCollapsed && (
              <div>
                <div className="font-bold text-slate-900 text-sm">Aviation Theory Services</div>
                <div className="text-xs text-slate-500">ATPL Training Platform</div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              currentView === 'dashboard' 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-colors ${currentView === 'dashboard' ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-8-14z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">Dashboard</div>
                <div className="text-xs text-slate-500">Overview & Statistics</div>
              </div>
            )}
          </button>

          <button
            onClick={() => setCurrentView('notes')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              currentView === 'notes' 
                ? 'bg-aviation-light text-aviation-primary shadow-sm' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-colors ${currentView === 'notes' ? 'bg-aviation-primary/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">Course Notes</div>
                <div className="text-xs text-slate-500">Study materials & OCR</div>
              </div>
            )}
          </button>

          <button
            onClick={() => setCurrentView('questions')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              currentView === 'questions' 
                ? 'bg-aviation-light text-aviation-primary shadow-sm' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-colors ${currentView === 'questions' ? 'bg-aviation-primary/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">Practice Questions</div>
                <div className="text-xs text-slate-500">{questions.length} available</div>
              </div>
            )}
          </button>

          <button
            onClick={() => setCurrentView('exam')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              currentView === 'exam' 
                ? 'bg-green-50 text-aviation-accent shadow-sm' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-colors ${currentView === 'exam' ? 'bg-aviation-accent/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">Trial Exam</div>
                <div className="text-xs text-slate-500">Timed practice session</div>
              </div>
            )}
          </button>

          <button
            onClick={() => setCurrentView('flightplan')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              currentView === 'flightplan' 
                ? 'bg-aviation-light text-aviation-primary shadow-sm' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-colors ${currentView === 'flightplan' ? 'bg-aviation-primary/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">Flight Planning</div>
                <div className="text-xs text-slate-500">Interactive worksheets</div>
              </div>
            )}
          </button>

          {hasProgress && (
            <button
              onClick={() => setCurrentView('analytics')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                currentView === 'analytics' 
                  ? 'bg-aviation-light text-aviation-primary shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-md transition-colors ${currentView === 'analytics' ? 'bg-aviation-primary/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <div className="font-medium text-sm">Analytics</div>
                  <div className="text-xs text-slate-500">Performance insights</div>
                </div>
              )}
            </button>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100">
          {hasProgress ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              {!sidebarCollapsed ? (
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-3">Study Progress</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-aviation-primary">{metrics.correctAnswers}</div>
                      <div className="text-xs text-slate-600">Correct</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-aviation-primary">{metrics.answeredQuestions}</div>
                      <div className="text-xs text-slate-600">Answered</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-aviation-accent">{metrics.accuracy.toFixed(0)}%</div>
                      <div className="text-xs text-slate-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-bold text-aviation-primary">{metrics.correctAnswers}</div>
                  <div className="text-xs text-slate-600">Correct</div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-aviation-primary to-aviation-navy hover:from-blue-500 hover:to-aviation-navy text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {sidebarCollapsed ? (
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                'Sign In to Track Progress'
              )}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Professional Header */}
        <header className="bg-gradient-to-r from-aviation-navy via-aviation-primary to-aviation-navy text-white shadow-lg z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Page Title */}
              <div>
                <h1 className="text-xl font-bold">
                  {currentView === 'dashboard' && 'Dashboard'}
                  {currentView === 'notes' && 'Course Notes'}
                  {currentView === 'questions' && 'Practice Questions'}
                  {currentView === 'exam' && 'Trial Exam'}
                  {currentView === 'flightplan' && 'Flight Planning'}
                  {currentView === 'analytics' && 'Performance Analytics'}
                </h1>
                <p className="text-white/80 text-sm mt-0.5">
                  {currentView === 'dashboard' && 'Welcome to your ATPL training center'}
                  {currentView === 'notes' && 'Study materials and course resources'}
                  {currentView === 'questions' && `${filteredQuestions.length} practice questions available`}
                  {currentView === 'exam' && 'Timed examination practice session'}
                  {currentView === 'flightplan' && 'Interactive flight planning worksheets'}
                  {currentView === 'analytics' && 'Track your learning progress'}
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                {/* Progress Stats */}
                {hasProgress && (
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <div className="text-center">
                        <div className="text-lg font-bold">{metrics.correctAnswers}</div>
                        <div className="text-xs text-white/70">Correct</div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <div className="text-center">
                        <div className="text-lg font-bold">{metrics.accuracy.toFixed(0)}%</div>
                        <div className="text-xs text-white/70">Accuracy</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Menu */}
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.email}</div>
                      <button
                        onClick={signOut}
                        className="text-xs text-white/70 hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{user.email?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 transition-all duration-200"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {currentView === 'dashboard' && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Aviation Theory Services</h2>
                  <p className="text-slate-600">
                    {hasProgress 
                      ? `You've answered ${metrics.answeredQuestions} questions with ${metrics.accuracy.toFixed(0)}% accuracy. Keep up the great work!`
                      : 'Start your ATPL journey with comprehensive practice questions and interactive flight planning tools.'
                    }
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <button
                    onClick={() => setCurrentView('notes')}
                    className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-aviation-primary hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 bg-aviation-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-aviation-primary/20 transition-colors">
                      <svg className="w-6 h-6 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Course Notes</h3>
                    <p className="text-sm text-slate-600">Study materials & OCR</p>
                  </button>

                  <button
                    onClick={() => setCurrentView('questions')}
                    className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-aviation-primary hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 bg-aviation-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-aviation-primary/20 transition-colors">
                      <svg className="w-6 h-6 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Practice Questions</h3>
                    <p className="text-sm text-slate-600 mb-2">{questions.length} questions available</p>
                    {hasProgress && (
                      <div className="text-xs text-aviation-primary font-medium">
                        {metrics.answeredQuestions} answered
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentView('exam')}
                    className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-aviation-accent hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-aviation-accent/20 transition-colors">
                      <svg className="w-6 h-6 text-aviation-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Trial Exam</h3>
                    <p className="text-sm text-slate-600">Timed practice session</p>
                  </button>

                  <button
                    onClick={() => setCurrentView('flightplan')}
                    className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-aviation-primary hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 bg-aviation-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-aviation-primary/20 transition-colors">
                      <svg className="w-6 h-6 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Flight Planning</h3>
                    <p className="text-sm text-slate-600">Interactive worksheets</p>
                  </button>

                  {hasProgress && (
                    <button
                      onClick={() => setCurrentView('analytics')}
                      className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-aviation-primary hover:shadow-lg transition-all duration-300 text-left"
                    >
                      <div className="w-12 h-12 bg-aviation-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-aviation-primary/20 transition-colors">
                        <svg className="w-6 h-6 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">Analytics</h3>
                      <p className="text-sm text-slate-600">Performance insights</p>
                    </button>
                  )}
                </div>

                {/* Recent Activity */}
                {hasProgress && userAnswers.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {userAnswers.slice(-5).reverse().map((answer, index) => {
                        const question = questions.find(q => q.id === answer.questionId);
                        const categoryName = question?.category ? questionCategories[question.category] : 'Unknown';
                        
                        return (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-900 text-sm truncate">
                                {question?.title || 'Unknown Question'}
                              </div>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-slate-500">{Math.round(answer.timeSpent)}s</span>
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
                            <div className="text-xs text-slate-500">
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
                  <div className="bg-gradient-to-r from-aviation-primary to-aviation-navy rounded-2xl p-8 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Ready to Begin Your ATPL Journey?</h3>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                      Start with practice questions to build your knowledge, then progress to flight planning exercises and comprehensive study materials.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setCurrentView('questions')}
                        className="bg-white text-aviation-navy font-semibold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors duration-300"
                      >
                        Start with Questions
                      </button>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-aviation-navy transition-colors duration-300"
                      >
                        Sign In for Progress Tracking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'notes' && (
            <div className="p-6">
              <CourseNotes />
            </div>
          )}

          {currentView === 'questions' && currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              studyMode={studyMode}
              userAnswer={userAnswers.find(a => a.questionId === currentQuestion.id)}
              onAnswerSubmit={handleAnswerSubmit}
              showWorkingSteps={storageService.loadSettings().showWorkingSteps}
            />
          )}

          {currentView === 'exam' && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-aviation-accent to-green-600 rounded-2xl p-8 text-white text-center mb-8">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Trial Exam Mode</h3>
                  <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                    Test your knowledge with a timed examination. This simulates real ATPL exam conditions to help you prepare effectively.
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{questions.length}</div>
                        <div className="text-xs text-green-100">Questions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">120</div>
                        <div className="text-xs text-green-100">Minutes</div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setStudyMode('exam');
                      setCurrentView('questions');
                    }}
                    className="mt-8 bg-white text-aviation-accent font-semibold py-3 px-8 rounded-xl hover:bg-green-50 transition-colors duration-300 shadow-lg"
                  >
                    Start Trial Exam
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Exam Conditions</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-aviation-accent rounded-full"></div>
                        <span>2 hour time limit</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-aviation-accent rounded-full"></div>
                        <span>All questions must be attempted</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-aviation-accent rounded-full"></div>
                        <span>No going back to previous questions</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-aviation-accent rounded-full"></div>
                        <span>Automatic submission when time expires</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Your Performance</h4>
                    {hasProgress ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Overall Accuracy</span>
                          <span className="font-bold text-slate-900">{metrics.accuracy.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Questions Answered</span>
                          <span className="font-bold text-slate-900">{metrics.answeredQuestions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Average Time/Question</span>
                          <span className="font-bold text-slate-900">{metrics.averageTimePerQuestion.toFixed(1)}s</span>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-800">
                            {metrics.accuracy >= 75 
                              ? "You're performing well! Ready for the trial exam." 
                              : "Consider more practice before attempting the trial exam."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-500 mb-4">Complete some practice questions first to see your performance metrics.</p>
                        <button 
                          onClick={() => setCurrentView('questions')}
                          className="text-aviation-primary hover:text-blue-700 font-medium text-sm"
                        >
                          Start with Practice Questions →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'flightplan' && (
            <div className="p-6">
              <FlightPlanTable />
            </div>
          )}

          {currentView === 'analytics' && hasProgress && (
            <div className="p-6">
              <PerformanceDashboard
                metrics={metrics}
                onClose={() => setCurrentView('dashboard')}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          currentStudyMode={studyMode}
          onStudyModeChange={setStudyMode}
        />
      )}

      {showLegend && (
        <LegendPopover onClose={() => setShowLegend(false)} />
      )}
    </div>
  );
};

export default AppShell;