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
import { useTheme } from '../contexts/ThemeContext';
import Calculator from './ui/Calculator';
import LegendPopover from './ui/LegendPopover';
import ExamTimer from './ui/ExamTimer';

const EnhancedFlightPlanningApp: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>('practice');
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionStartTime] = useState<Date>(new Date());
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    currentQuestionIndex: 0,
    answeredQuestions: new Set(),
    correctAnswers: new Set(),
    userAnswers: [],
    startTime: sessionStartTime,
    studyMode: 'practice'
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [currentView, setCurrentView] = useState<'menu' | 'questions' | 'flightplan' | 'notes'>('menu');
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const filteredQuestions = useMemo(() => {
    if (categoryFilter === 'all') return questions;
    return questions.filter(q => q.category === categoryFilter);
  }, [questions, categoryFilter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

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

  // Start/stop 3-hour exam timer when mode changes
  useEffect(() => {
    if (studyMode === 'exam') {
      // If we already have an end time from storage, keep it; else set default 3 hours from now.
      if (!sessionProgress.examEndTime || sessionProgress.examEndTime.getTime() <= Date.now()) {
        const end = new Date(Date.now() + 3 * 60 * 60 * 1000);
        setSessionProgress(prev => ({ ...prev, examEndTime: end }));
      }
    } else if (studyMode === 'practice' && sessionProgress.examEndTime) {
      setSessionProgress(prev => ({ ...prev, examEndTime: undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMode]);

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

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < filteredQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const resetSession = async () => {
    if (confirm('Are you sure you want to reset your progress? This will clear all answers and start fresh.')) {
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      
      if (user) {
        // Create new study session
        try {
          const sessionId = await databaseService.createStudySession('practice');
          setCurrentSessionId(sessionId);
        } catch (error) {
          console.error('Failed to create new session:', error);
        }
      }
      
      storageService.clearAllData();
    }
  };

  const handleAuthSuccess = () => {
    // Reload data after successful authentication
    window.location.reload();
  };

  const currentUserAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id);
  const metrics = calculatePerformanceMetrics();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="aviation-card p-8 text-center">
          <div className="text-lg font-medium text-gray-700 mb-2">Loading ATPL Study Tool...</div>
          <div className="text-sm text-gray-500">Please wait while we prepare your session</div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="aviation-card p-8 text-center">
          <h2 className="text-xl font-bold mb-4">No questions available</h2>
          <p className="text-gray-600">
            {categoryFilter === 'all' 
              ? 'No questions found in the database.'
              : `No questions found for category: ${questionCategories[categoryFilter as QuestionCategory]}`
            }
          </p>
          {categoryFilter !== 'all' && (
            <button 
              className="aviation-button mt-4"
              onClick={() => setCategoryFilter('all')}
            >
              Show All Categories
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fade-in" style={{ backgroundColor: theme === 'dark' ? '#0b1220' : '#f8fafc' }}>
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-aviation-primary via-aviation-secondary to-blue-800"></div>
        <div className="absolute inset-0" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", opacity: 0.3}}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-2xl">✈️</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-aviation-accent rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">A</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
                  ATPL Flight Planning
                </h1>
                <p className="text-blue-100 text-sm font-medium">Professional Study Tool</p>
              </div>
            </div>
            
            {/* Navigation and Controls */}
            <div className="flex items-center space-x-6">
              {/* Main Navigation */}
              <nav className="hidden lg:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setCurrentView('menu')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentView === 'menu' 
                      ? 'bg-white text-aviation-primary shadow-lg transform scale-105' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🏠 Home
                </button>
                <button
                  onClick={() => setCurrentView('questions')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentView === 'questions' 
                      ? 'bg-white text-aviation-primary shadow-lg transform scale-105' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📚 Questions
                </button>
                <button
                  onClick={() => setCurrentView('flightplan')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentView === 'flightplan' 
                      ? 'bg-white text-aviation-primary shadow-lg transform scale-105' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🛩️ Flight Plan
                </button>
                <button
                  onClick={() => setCurrentView('notes')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentView === 'notes' 
                      ? 'bg-white text-aviation-primary shadow-lg transform scale-105' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📝 Notes
                </button>
              </nav>

              {/* User Status */}
              {user ? (
                <div className="hidden md:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <div className="h-6 w-6 bg-aviation-accent rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{user.email?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-white font-medium">{user.email}</div>
                    <button
                      onClick={signOut}
                      className="text-blue-200 hover:text-white text-xs underline decoration-white/40 hover:decoration-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/20 transition-all duration-200 hover:scale-105"
                >
                  🔐 Sign In
                </button>
              )}
              
              {/* Progress Indicator */}
              <div className="hidden sm:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{metrics.correctAnswers}</div>
                  <div className="text-blue-200 text-xs">Correct</div>
                </div>
                <div className="text-blue-200 text-2xl">/</div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{metrics.answeredQuestions}</div>
                  <div className="text-blue-200 text-xs">Answered</div>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center space-x-2">
                {studyMode === 'exam' && sessionProgress.examEndTime && (
                  <ExamTimer
                    endTime={sessionProgress.examEndTime}
                    onExpire={() => alert('Time is up! Please submit your answers.')}
                  />
                )}
                
                <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Performance Analytics"
                  >
                    📊
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Settings"
                  >
                    ⚙️
                  </button>
                  
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Open calculator"
                  >
                    🧮
                  </button>

                  <button
                    onClick={() => setShowLegend(prev => !prev)}
                    className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Flight plan legend"
                  >
                    ℹ️
                  </button>
                </div>

                {showLegend && (
                  <LegendPopover onClose={() => setShowLegend(false)} />
                )}

                {/* Theme Selector */}
                <div className="relative">
                  <select
                    aria-label="Theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer hover:bg-white/20 transition-all duration-200"
                    title={`Theme (${resolvedTheme})`}
                  >
                    <option value="system" className="text-gray-800">🌓 System</option>
                    <option value="light" className="text-gray-800">☀️ Light</option>
                    <option value="dark" className="text-gray-800">🌙 Dark</option>
                  </select>
                </div>
                
                {/* Study Mode Selector */}
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value as StudyMode)}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer hover:bg-white/20 transition-all duration-200"
                >
                  <option value="practice" className="text-gray-800">🎯 Practice</option>
                  <option value="exam" className="text-gray-800">📝 Exam</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Only show for questions view */}
      {currentView === 'questions' && (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as QuestionCategory | 'all')}
                    className="aviation-input text-sm bg-white border-gray-300 focus:border-aviation-primary focus:ring-aviation-primary/20"
                  >
                    <option value="all">📚 All Categories</option>
                    {Object.entries(questionCategories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <span className="font-medium">Question</span>
                    <span className="bg-aviation-primary text-white px-3 py-1 rounded-lg font-bold">
                      {currentQuestionIndex + 1}
                    </span>
                    <span className="text-gray-500">of</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-bold">
                      {filteredQuestions.length}
                    </span>
                  </div>
                </div>

                {user && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <span>☁️</span>
                    <span>Synced to cloud</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  className="aviation-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Previous
                </button>
                
                <button
                  className="aviation-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                >
                  Next →
                </button>
                
                <button
                  className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  onClick={resetSession}
                >
                  🔄 Reset Session
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Progress Bar - Only show for questions view */}
      {currentView === 'questions' && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-aviation-primary h-2.5 rounded-full"
                style={{ 
                  width: `${(sessionProgress.answeredQuestions.size / filteredQuestions.length) * 100}%`,
                  transition: 'width 400ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Progress: {sessionProgress.answeredQuestions.size}/{filteredQuestions.length} questions</span>
              <span>Accuracy: {metrics.accuracy.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {currentView === 'menu' ? (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-aviation-primary/10 via-aviation-secondary/10 to-blue-600/10"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              
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
                      onClick={() => setCurrentView('questions')}
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
                      onClick={() => setCurrentView('flightplan')}
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
                      onClick={() => setCurrentView('notes')}
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
                  <div className="absolute inset-0" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
                  <div className="relative">
                    <h2 className="text-3xl font-bold mb-4">Ready to Excel in ATPL Flight Planning?</h2>
                                         <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                       Join ATPL Theory Students across Australia who have successfully passed their ATPL exams using our comprehensive training platform.
                     </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setCurrentView('questions')}
                        className="bg-white text-aviation-primary font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                      >
                        Begin Training
                      </button>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-aviation-primary transition-colors duration-300"
                      >
                        Access Platform
                      </button>
                    </div>
                  </div>
                </div>
              </div>
           </div>
         ) : currentView === 'questions' ? (
          <QuestionDisplay
            question={currentQuestion}
            studyMode={studyMode}
            userAnswer={currentUserAnswer}
            onAnswerSubmit={handleAnswerSubmit}
            showWorkingSteps={storageService.loadSettings().showWorkingSteps}
          />
        ) : currentView === 'flightplan' ? (
          <div className="max-w-6xl mx-auto p-6">
            <FlightPlanTable />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto p-6">
            <CourseNotes />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-10" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-white border text-gray-700">Session {Math.floor((Date.now() - sessionStartTime.getTime()) / 60000)}m</span>
              {user && <span className="px-2 py-1 rounded bg-green-50 border border-green-200 text-green-700">● Cloud Sync</span>}
            </div>
            <div className="flex items-center space-x-4">
              <span>Avg time/question: {metrics.averageTimePerQuestion.toFixed(1)}s</span>
              <button 
                className="aviation-button-secondary"
                onClick={() => {
                  const data = storageService.exportData();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `atpl-study-session-${Date.now()}.json`;
                  a.click();
                }}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showDashboard && (
        <PerformanceDashboard
          metrics={metrics}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          currentStudyMode={studyMode}
          onStudyModeChange={setStudyMode}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
};

export default EnhancedFlightPlanningApp;