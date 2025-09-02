import React, { useState, useEffect } from 'react';
import { Card, PrimaryButton, SecondaryButton, useDesignSystem } from '../design-system';
import type { Question } from '../types';

const QuestionsPage: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate loading questions
    setTimeout(() => {
      setQuestions([
        {
          id: '1',
          title: 'What is the primary purpose of flight planning?',
          options: ['Navigation', 'Safety', 'Efficiency', 'All of the above'],
          correctAnswer: 'All of the above',
          category: 'flight_planning_basics',
          marks: 1
        },
        {
          id: '2',
          title: 'Which factor affects aircraft performance most significantly?',
          options: ['Wind', 'Temperature', 'Altitude', 'Humidity'],
          correctAnswer: 'Altitude',
          category: 'performance',
          marks: 1
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: spacing.scale[6] }}>
        <Card style={{ padding: spacing.scale[4], textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '2rem',
            width: '2rem',
            border: `2px solid ${colors.aviation.primary}`,
            borderTop: '2px solid transparent',
            margin: '0 auto',
            marginBottom: spacing.scale[3]
          }} />
          <p style={{ color: colors.aviation.text }}>
            Loading questions...
          </p>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    return (
      <div style={{ padding: spacing.scale[6] }}>
        <Card style={{ padding: spacing.scale[4], textAlign: 'center' }}>
          <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[4] }}>
            Quiz Results
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.aviation.primary, marginBottom: spacing.scale[2] }}>
            {correctAnswers}/{totalQuestions}
          </div>
          <div style={{ fontSize: '1.125rem', color: colors.aviation.muted, marginBottom: spacing.scale[4] }}>
            {percentage.toFixed(1)}% Correct
          </div>
          <SecondaryButton
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setUserAnswers({});
            }}
            style={{ marginTop: spacing.scale[4] }}
          >
            Retake Quiz
          </SecondaryButton>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ padding: spacing.scale[6] }}>
      <Card style={{ padding: spacing.scale[6] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.scale[4] }}>
          <h2 style={{ ...styles.heading, fontSize: '1.5rem' }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>
            {currentQuestion.category.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <p style={{ ...styles.body, fontSize: '1.125rem', lineHeight: '1.6' }}>
            {currentQuestion.title}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3], marginBottom: spacing.scale[6] }}>
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              style={{
                padding: spacing.scale[4],
                border: `2px solid ${userAnswers[currentQuestion.id] === option ? colors.aviation.primary : colors.gray[200]}`,
                borderRadius: spacing.radius.lg,
                background: userAnswers[currentQuestion.id] === option ? colors.withOpacity(colors.aviation.primary, 0.05) : colors.white,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                color: colors.aviation.navy
              }}
            >
              <span style={{ fontWeight: 600, marginRight: spacing.scale[2] }}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SecondaryButton
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.scale[2],
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </SecondaryButton>
          
          <PrimaryButton
            onClick={handleNext}
            disabled={!userAnswers[currentQuestion.id]}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.scale[2],
              opacity: userAnswers[currentQuestion.id] ? 1 : 0.5,
              cursor: userAnswers[currentQuestion.id] ? 'pointer' : 'not-allowed'
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next →'}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default QuestionsPage;