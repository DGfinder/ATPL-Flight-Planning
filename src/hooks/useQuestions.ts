import { useState, useEffect, useMemo } from 'react';
import type { Question, QuestionCategory } from '../types';
import { sampleQuestions } from '../data/questions';
import { databaseService } from '../services/database';

export const useQuestions = (categoryFilter: QuestionCategory | 'all' = 'all') => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredQuestions = useMemo(() => {
    if (categoryFilter === 'all') return questions;
    return questions.filter(q => q.category === categoryFilter);
  }, [questions, categoryFilter]);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        console.log('Loading questions from database...');
        const dbQuestions = await databaseService.getAllQuestions();
        console.log('Database questions loaded:', dbQuestions);
        
        if (dbQuestions && dbQuestions.length > 0) {
          setQuestions(dbQuestions);
          console.log('Using database questions:', dbQuestions.length);
        } else {
          console.log('No database questions found, using sample questions');
          setQuestions(sampleQuestions);
        }
      } catch (error) {
        console.error('Failed to load questions from database:', error);
        console.log('Falling back to sample questions');
        setQuestions(sampleQuestions);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []); // Remove user dependency to always try loading

  return {
    questions,
    filteredQuestions,
    loading,
    totalQuestions: questions.length,
    filteredCount: filteredQuestions.length
  };
};