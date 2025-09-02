import React, { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, useDesignSystem } from '../../design-system';
import type { Question } from '../../types';

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  userAnswer?: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  userAnswer
}) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || '');

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  return (
    <div style={{ padding: spacing.scale[6] }}>
      <Card style={{ padding: spacing.scale[6], marginBottom: spacing.scale[6] }}>
        <h2 style={{ 
          ...styles.heading, 
          fontSize: '1.5rem', 
          marginBottom: spacing.scale[4],
          color: colors.aviation.primary,
          fontWeight: 600
        }}>
          Question {question.id}
        </h2>
        
        <div style={{ marginBottom: spacing.scale[6] }}>
          <p style={{ ...styles.body, fontSize: '1rem', lineHeight: '1.6' }}>
            {question.title}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              style={{
                padding: spacing.scale[4],
                border: `2px solid ${selectedAnswer === option ? colors.aviation.primary : colors.gray[200]}`,
                borderRadius: spacing.radius.lg,
                background: selectedAnswer === option ? colors.withOpacity(colors.aviation.primary, 0.05) : colors.white,
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
      </Card>

      <Card style={{ padding: spacing.scale[6], marginTop: spacing.scale[6] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SecondaryButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            style={{ opacity: hasPrevious ? 1 : 0.5 }}
          >
            ← Previous
          </SecondaryButton>
          
          <PrimaryButton
            onClick={onNext}
            disabled={!hasNext}
            style={{ opacity: hasNext ? 1 : 0.5 }}
          >
            Next →
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default QuestionDisplay;