import { useState, useEffect, useCallback } from 'react';
import type { UserAnswer, PerformanceMetrics, QuestionCategory } from '../types';
import { questionCategories } from '../data/questions';
import { databaseService } from '../services/database';
import { storageService } from '../utils/localStorage';
import { useAuth } from './useAuth';

export const useUserProgress = (questions: any[]) => {
  const { user } = useAuth();
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        if (user) {
          const dbAnswers = await databaseService.getUserProgress();
          setUserAnswers(dbAnswers || []);
        } else {
          const localAnswers = storageService.loadUserAnswers();
          setUserAnswers(localAnswers);
        }
      } catch (error) {
        console.error('Failed to load user progress:', error);
        const localAnswers = storageService.loadUserAnswers();
        setUserAnswers(localAnswers);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  const saveAnswer = useCallback(async (answer: UserAnswer) => {
    const updatedAnswers = [
      ...userAnswers.filter(a => a.questionId !== answer.questionId),
      answer
    ];
    
    setUserAnswers(updatedAnswers);
    
    try {
      if (user) {
        await databaseService.saveUserAnswer(answer);
      } else {
        storageService.saveUserAnswers(updatedAnswers);
      }
    } catch (error) {
      console.error('Failed to save answer:', error);
      storageService.saveUserAnswers(updatedAnswers);
    }
  }, [user, userAnswers]);

  const calculateMetrics = useCallback((): PerformanceMetrics => {
    const totalQuestions = questions.length;
    const answeredQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    const totalTime = userAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTimePerQuestion = answeredQuestions > 0 ? totalTime / answeredQuestions : 0;

    const categoryPerformance: Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }> = {} as Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }>;
    
    Object.keys(questionCategories || {}).forEach(cat => {
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
  }, [questions, userAnswers]);

  return {
    userAnswers,
    loading,
    saveAnswer,
    metrics: calculateMetrics(),
    hasProgress: userAnswers.length > 0
  };
};