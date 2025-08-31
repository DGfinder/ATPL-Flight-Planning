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
  const [currentView, setCurrentView] = useState<'questions' | 'flightplan' | 'notes'>('questions');
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
      <header className="text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #0A2A66 0%, #0056D6 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">✈️</div>
              <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>ATPL Flight Planning</h1>
            </div>
            
            <div className="flex items-center space-x-5">
              <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('questions')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    currentView === 'questions' 
                      ? 'bg-white text-aviation-primary shadow-sm' 
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  Questions
                </button>
                <button
                  onClick={() => setCurrentView('flightplan')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    currentView === 'flightplan' 
                      ? 'bg-white text-aviation-primary shadow-sm' 
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  Flight Plan
                </button>
                <button
                  onClick={() => setCurrentView('notes')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    currentView === 'notes' 
                      ? 'bg-white text-aviation-primary shadow-sm' 
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* User Info */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="text-blue-100">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="underline decoration-white/40 hover:decoration-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-blue-100 hover:text-white text-sm underline"
                >
                  Sign In
                </button>
              )}
              
              <div className="hidden sm:flex items-center text-sm bg-white/10 rounded-md px-2 py-1">
                <span className="font-medium">{metrics.correctAnswers}</span>
                <span className="text-blue-100 mx-1">/</span>
                <span>{metrics.answeredQuestions}</span>
                <span className="text-blue-100 ml-1">correct</span>
              </div>
              
              <div className="flex items-center space-x-2 relative">
                {studyMode === 'exam' && sessionProgress.examEndTime && (
                  <ExamTimer
                    endTime={sessionProgress.examEndTime}
                    onExpire={() => alert('Time is up! Please submit your answers.')}
                  />
                )}
                <button
                  onClick={() => setShowDashboard(true)}
                  className="text-blue-100 hover:text-white text-sm"
                  title="Performance Analytics"
                >
                  📊
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-blue-100 hover:text-white text-sm"
                  title="Settings"
                >
                  ⚙️
                </button>
                
                <button
                  onClick={() => setShowCalculator(true)}
                  className="text-blue-100 hover:text-white text-sm"
                  title="Open calculator"
                >
                  🧮
                </button>

                <button
                  onClick={() => setShowLegend(prev => !prev)}
                  className="text-blue-100 hover:text-white text-sm"
                  title="Flight plan legend"
                >
                  ℹ️
                </button>

                {showLegend && (
                  <LegendPopover onClose={() => setShowLegend(false)} />
                )}

                <div className="relative">
                  <select
                    aria-label="Theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="text-black px-2 py-1.5 rounded-md text-sm"
                    title={`Theme (${resolvedTheme})`}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value as StudyMode)}
                  className="text-black px-2 py-1.5 rounded-md text-sm"
                >
                  <option value="practice">Practice Mode</option>
                  <option value="exam">Exam Mode</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Only show for questions view */}
      {currentView === 'questions' && (
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as QuestionCategory | 'all')}
                  className="aviation-input text-sm"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(questionCategories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                
                <div className="text-sm text-gray-600">
                  Question <strong>{currentQuestionIndex + 1}</strong> of <strong>{filteredQuestions.length}</strong>
                </div>

                {user && (
                  <div className="text-xs text-gray-500">
                    Synced to cloud ☁️
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  className="aviation-button-secondary"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                
                <button
                  className="aviation-button-secondary"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                >
                  Next
                </button>
                
                <button
                  className="text-sm text-red-600 hover:text-red-800 ml-4"
                  onClick={resetSession}
                >
                  Reset Session
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
        {currentView === 'questions' ? (
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
        <Calculator onClose={() => setShowCalculator(false)} />)
      }
    </div>
  );
};

export default EnhancedFlightPlanningApp;