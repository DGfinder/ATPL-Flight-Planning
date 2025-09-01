import { useState, useEffect, useMemo } from 'react';
import type { Question, QuestionCategory } from '../types';
import { sampleQuestions } from '../data/questions';
import { databaseService } from '../services/database';
import { useAuth } from './useAuth';

export const useQuestions = (categoryFilter: QuestionCategory | 'all' = 'all') => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [loading, setLoading] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (categoryFilter === 'all') return questions;
    return questions.filter(q => q.category === categoryFilter);
  }, [questions, categoryFilter]);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const dbQuestions = await databaseService.getAllQuestions();
        if (dbQuestions && dbQuestions.length > 0) {
          setQuestions(dbQuestions);
        }
      } catch (error) {
        console.error('Failed to load questions from database:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [user]);

  return {
    questions,
    filteredQuestions,
    loading,
    totalQuestions: questions.length,
    filteredCount: filteredQuestions.length
  };
};