import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question, AtplSubject, UserAnswer } from '../../types';
import { sampleQuestions, questionCategories } from '../../data/questions';
import { databaseService } from '../../services/database';
import { storageService } from '../../utils/localStorage';
import { useAuth } from '../../hooks/useAuth';
import QuestionDisplay from './QuestionDisplay';

interface SubjectQuestionsProps {
  subject: AtplSubject;
  onComplete?: (results: { correct: number; total: number; accuracy: number }) => void;
  className?: string;
}

const SubjectQuestions: React.FC<SubjectQuestionsProps> = ({
  subject,
  onComplete,
  className = ''
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'practice' | 'results'>('overview');

  // Filter questions based on subject's question categories
  const subjectQuestions = useMemo(() => {
    return questions.filter(q => subject.questionCategories.includes(q.category));
  }, [questions, subject.questionCategories]);

  const currentQuestion = subjectQuestions[currentQuestionIndex];

  // Load user progress and questions
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user) {
          const progress = await databaseService.getUserProgress();
          if (progress) {
            setUserAnswers(progress);
          }

          try {
            const dbQuestions = await databaseService.getAllQuestions();
            if (dbQuestions && dbQuestions.length > 0) {
              setQuestions(dbQuestions);
            }
          } catch (dbError) {
            console.warn('Using sample questions:', dbError);
          }
        } else {
          const localProgress = storageService.loadUserAnswers();
          setUserAnswers(localProgress);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calculate statistics
  const stats = useMemo(() => {
    const subjectAnswers = userAnswers.filter(answer => 
      subjectQuestions.some(q => q.id === answer.questionId)
    );
    
    const totalQuestions = subjectQuestions.length;
    const attemptedQuestions = subjectAnswers.length;
    const correctAnswers = subjectAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = attemptedQuestions > 0 ? (correctAnswers / attemptedQuestions) * 100 : 0;

    return {
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      accuracy,
      remainingQuestions: totalQuestions - attemptedQuestions
    };
  }, [userAnswers, subjectQuestions]);

  const handleAnswerSubmit = async (answer: UserAnswer) => {
    setSessionAnswers(prev => [...prev, answer]);
    
    // Save to storage
    const updatedAnswers = [...userAnswers, answer];
    setUserAnswers(updatedAnswers);

    if (user) {
      try {
        await databaseService.saveUserAnswer(answer);
      } catch (error) {
        console.error('Failed to save answer to database:', error);
        storageService.saveUserAnswers(updatedAnswers);
      }
    } else {
      storageService.saveUserAnswers(updatedAnswers);
    }

    // Move to next question or show results
    if (currentQuestionIndex < subjectQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResults(true);
        setViewMode('results');
        
        const sessionStats = {
          correct: sessionAnswers.filter(a => a.isCorrect).length + (answer.isCorrect ? 1 : 0),
          total: sessionAnswers.length + 1,
          accuracy: 0
        };
        sessionStats.accuracy = (sessionStats.correct / sessionStats.total) * 100;
        
        onComplete?.(sessionStats);
      }, 1500);
    }
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setSessionAnswers([]);
    setShowResults(false);
    setViewMode('overview');
  };

  const startPractice = () => {
    setViewMode('practice');
    setCurrentQuestionIndex(0);
    setSessionAnswers([]);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className={`subject-questions ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading questions...</span>
        </div>
      </div>
    );
  }

  if (subjectQuestions.length === 0) {
    return (
      <div className={`subject-questions ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions available</h3>
          <p className="text-gray-600 mb-6">
            Questions for this subject will be added soon.
          </p>
          <button
            onClick={() => navigate('/questions')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Questions
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'practice' && currentQuestion && !showResults) {
    return (
      <div className={`subject-questions ${className}`}>
        {/* Practice header */}
        <div className="bg-white border-b border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {subject.title} - Practice Questions
              </h3>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {subjectQuestions.length}
              </p>
            </div>
            <button
              onClick={() => setViewMode('overview')}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Back to Overview
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / subjectQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <QuestionDisplay
          question={currentQuestion}
          onAnswerSubmit={handleAnswerSubmit}
          studyMode="practice"
        />
      </div>
    );
  }

  if (viewMode === 'results') {
    const sessionStats = {
      correct: sessionAnswers.filter(a => a.isCorrect).length,
      total: sessionAnswers.length,
      accuracy: sessionAnswers.length > 0 ? (sessionAnswers.filter(a => a.isCorrect).length / sessionAnswers.length) * 100 : 0
    };

    return (
      <div className={`subject-questions ${className}`}>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-6xl mb-6">
            {sessionStats.accuracy >= 80 ? '🎉' : sessionStats.accuracy >= 60 ? '👍' : '📚'}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{sessionStats.correct}</div>
              <div className="text-sm text-blue-800">Correct Answers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-600">{sessionStats.total}</div>
              <div className="text-sm text-gray-800">Total Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{sessionStats.accuracy.toFixed(0)}%</div>
              <div className="text-sm text-green-800">Accuracy</div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={startPractice}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Practice Again
            </button>
            <button
              onClick={resetSession}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Overview mode (default)
  return (
    <div className={`subject-questions ${className}`}>
      {/* Subject question overview */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-3xl">❓</div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {subject.title} - Practice Questions
            </h2>
            <p className="text-gray-600">
              Questions covering {subject.questionCategories.length} categories
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
            <div className="text-sm text-blue-800">Total Questions</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.attemptedQuestions}</div>
            <div className="text-sm text-green-800">Attempted</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.correctAnswers}</div>
            <div className="text-sm text-yellow-800">Correct</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.accuracy.toFixed(0)}%</div>
            <div className="text-sm text-purple-800">Accuracy</div>
          </div>
        </div>

        {/* Question categories */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Question Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {subject.questionCategories.map(category => (
              <span
                key={category}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {questionCategories[category] || category.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={startPractice}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            🚀 Start Practice Session
          </button>
          <button
            onClick={() => navigate('/questions', { 
              state: { 
                categoryFilter: subject.questionCategories[0] || 'all' 
              } 
            })}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            📝 View All Questions
          </button>
        </div>
      </div>

      {/* Progress indicator if user has attempted some questions */}
      {stats.attemptedQuestions > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Subject Progress</span>
            <span className="text-sm text-gray-600">
              {stats.attemptedQuestions}/{stats.totalQuestions} questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.attemptedQuestions / stats.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectQuestions;