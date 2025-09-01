import React, { useState, useEffect, useMemo } from 'react';
import type { Question, UserAnswer, StudyMode, QuestionCategory } from '../types';
import { sampleQuestions, questionCategories } from '../data/questions';
import { storageService } from '../utils/localStorage';
import { databaseService } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import QuestionDisplay from '../components/questions/QuestionDisplay';

const QuestionsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Core state
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>('practice');
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          const progress = await databaseService.getUserProgress();
          if (progress) {
            setUserAnswers(progress);
          }

          try {
            const dbQuestions = await databaseService.getAllQuestions();
            if (dbQuestions && dbQuestions.length > 0) {
              setQuestions(dbQuestions);
            }
          } catch (error) {
            console.warn('Could not load questions from database, using sample questions');
          }
        } else {
          // Load from localStorage for guest users
          const localProgress = storageService.loadUserAnswers();
          setUserAnswers(localProgress);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to localStorage
        const localProgress = storageService.loadUserAnswers();
        setUserAnswers(localProgress);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

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
    
    // Auto advance if setting is enabled and answer is correct
    if (studyMode === 'practice' && storageService.loadSettings().autoAdvanceOnCorrect && answer.isCorrect) {
      setTimeout(() => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 1500);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuestionIndex = () => {
    setCurrentQuestionIndex(0);
  };

  // Reset question index when category filter changes
  useEffect(() => {
    resetQuestionIndex();
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="aviation-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-aviation-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-aviation-text">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-8">
        <div className="aviation-card p-8 text-center">
          <div className="w-16 h-16 bg-aviation-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-aviation-navy mb-2">No Questions Available</h3>
          <p className="text-aviation-muted">
            {categoryFilter === 'all' 
              ? 'No questions found in the database.'
              : `No questions found for category: ${categoryFilter.replace('_', ' ')}`
            }
          </p>
          {categoryFilter !== 'all' && (
            <button
              onClick={() => setCategoryFilter('all')}
              className="aviation-button-secondary mt-4"
            >
              Show All Categories
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Question Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-aviation-text mb-2">
                Category Filter
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as QuestionCategory | 'all')}
                className="aviation-input text-sm"
              >
                <option value="all">All Categories ({questions.length})</option>
                {Object.entries(questionCategories).map(([key, label]) => {
                  const count = questions.filter(q => q.category === key).length;
                  return (
                    <option key={key} value={key}>
                      {label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-aviation-text mb-2">
                Study Mode
              </label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value as StudyMode)}
                className="aviation-input text-sm"
              >
                <option value="practice">Practice Mode</option>
                <option value="exam">Exam Mode</option>
              </select>
            </div>
          </div>

          {/* Progress Info */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-aviation-primary">
                {currentQuestionIndex + 1}
              </div>
              <div className="text-sm text-aviation-muted">of {filteredQuestions.length}</div>
            </div>
            
            {userAnswers.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-aviation-secondary">
                  {userAnswers.filter(a => a.isCorrect).length}
                </div>
                <div className="text-sm text-aviation-muted">Correct</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="aviation-button-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-aviation-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-aviation-muted whitespace-nowrap">
              {Math.round(((currentQuestionIndex + 1) / filteredQuestions.length) * 100)}%
            </span>
          </div>

          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === filteredQuestions.length - 1}
            className="aviation-button-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Question Display */}
      <QuestionDisplay
        question={currentQuestion}
        studyMode={studyMode}
        userAnswer={userAnswers.find(a => a.questionId === currentQuestion.id)}
        onAnswerSubmit={handleAnswerSubmit}
        showWorkingSteps={storageService.loadSettings().showWorkingSteps}
      />

      {/* Question Navigation Footer */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="text-aviation-muted">
            Question ID: {currentQuestion.id}
          </div>
          <div className="flex items-center space-x-4 text-aviation-muted">
            <span>Category: {questionCategories[currentQuestion.category]}</span>
            <span>•</span>
            <span>Type: {currentQuestion.type.replace('_', ' ')}</span>
            <span>•</span>
            <span>Marks: {currentQuestion.marks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;