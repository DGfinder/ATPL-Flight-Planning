import React, { useState, useEffect, useMemo } from 'react';
import type { Question, UserAnswer, SessionProgress, StudyMode, QuestionCategory, PerformanceMetrics } from '../types';
import { sampleQuestions, questionCategories } from '../data/questions';
import { storageService } from '../utils/localStorage';
import QuestionDisplay from './questions/QuestionDisplay';
import PerformanceDashboard from './ui/PerformanceDashboard';
import SettingsPanel from './ui/SettingsPanel';
import FlightPlanTable from './flight-plan/FlightPlanTable';
import CourseNotes from './notes/CourseNotes';

const FlightPlanningApp: React.FC = () => {
  const [questions] = useState<Question[]>(sampleQuestions);
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
  const [currentView, setCurrentView] = useState<'questions' | 'flightplan' | 'notes'>('questions');

  const filteredQuestions = useMemo(() => {
    if (categoryFilter === 'all') return questions;
    return questions.filter(q => q.category === categoryFilter);
  }, [questions, categoryFilter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const progress: SessionProgress = {
      currentQuestionIndex,
      answeredQuestions: new Set(userAnswers.map(a => a.questionId)),
      correctAnswers: new Set(userAnswers.filter(a => a.isCorrect).map(a => a.questionId)),
      userAnswers,
      startTime: sessionStartTime,
      categoryFilter: categoryFilter === 'all' ? undefined : categoryFilter,
      studyMode
    };
    
    setSessionProgress(progress);
    storageService.saveSessionProgress(progress);
  }, [currentQuestionIndex, userAnswers, categoryFilter, studyMode, sessionStartTime]);

  const handleAnswerSubmit = (answer: UserAnswer) => {
    const updatedAnswers = [
      ...userAnswers.filter(a => a.questionId !== answer.questionId),
      answer
    ];
    
    setUserAnswers(updatedAnswers);
    storageService.saveUserAnswers(updatedAnswers);
    
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

  const resetSession = () => {
    if (confirm('Are you sure you want to reset your progress? This will clear all answers and start fresh.')) {
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      storageService.clearAllData();
    }
  };

  const currentUserAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id);
  const metrics = calculatePerformanceMetrics();

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-aviation-primary text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">ATPL Flight Planning Study Tool</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('questions')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentView === 'questions' 
                      ? 'bg-white text-aviation-primary' 
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  Questions
                </button>
                <button
                  onClick={() => setCurrentView('flightplan')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentView === 'flightplan' 
                      ? 'bg-white text-aviation-primary' 
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  Flight Plan
                </button>
                <button
                  onClick={() => setCurrentView('notes')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentView === 'notes' 
                      ? 'bg-white text-aviation-primary' 
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  Notes
                </button>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">{metrics.correctAnswers}</span>
                <span className="text-blue-200 mx-1">/</span>
                <span>{metrics.answeredQuestions}</span>
                <span className="text-blue-200 ml-1">correct</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDashboard(true)}
                  className="text-blue-200 hover:text-white text-sm"
                  title="Performance Analytics"
                >
                  📊
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-blue-200 hover:text-white text-sm"
                  title="Settings"
                >
                  ⚙️
                </button>
                
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value as StudyMode)}
                  className="text-black px-2 py-1 rounded text-sm"
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
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-aviation-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(sessionProgress.answeredQuestions.size / filteredQuestions.length) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
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
      <footer className="bg-gray-100 border-t mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Session time: {Math.floor((Date.now() - sessionStartTime.getTime()) / 60000)} minutes
            </div>
            <div className="flex items-center space-x-4">
              <span>Average time per question: {metrics.averageTimePerQuestion.toFixed(1)}s</span>
              <button 
                className="text-aviation-primary hover:underline"
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
    </div>
  );
};

export default FlightPlanningApp;