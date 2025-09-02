import React, { useState, useEffect } from 'react';
import type { Question, UserAnswer } from '../../types';
import { AviationCalculations } from '../../utils/aviationCalculations';
import { Button, useDesignSystem } from '../../design-system';

interface ShortAnswerQuestionProps {
  question: Question;
  onAnswerSubmit: (answer: UserAnswer) => void;
  showFeedback?: boolean;
  userAnswer?: UserAnswer;
}

interface FieldValidation {
  isCorrect: boolean;
  expected: number;
  actual: number;
  tolerance: number;
  unit: string;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  onAnswerSubmit,
  showFeedback = false,
  userAnswer
}) => {
  const { colors, spacing } = useDesignSystem();
  const [answers, setAnswers] = useState<Record<string, string>>(
    userAnswer?.shortAnswers 
      ? Object.fromEntries(
          Object.entries(userAnswer.shortAnswers).map(([k, v]) => [k, v.toString()])
        )
      : {}
  );
  const [startTime] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(userAnswer !== undefined);
  const [validationResults, setValidationResults] = useState<Record<string, FieldValidation>>({});

  useEffect(() => {
    if (showFeedback && isSubmitted && userAnswer?.shortAnswers) {
      const results: Record<string, FieldValidation> = {};
      
      question.expectedAnswers?.forEach(expected => {
        const actualValue = userAnswer.shortAnswers?.[expected.field] ?? 0;
        const isCorrect = AviationCalculations.validateAnswer(
          actualValue, 
          expected.value, 
          expected.tolerance
        );
        
        results[expected.field] = {
          isCorrect,
          expected: expected.value,
          actual: actualValue,
          tolerance: expected.tolerance,
          unit: expected.unit
        };
      });
      
      setValidationResults(results);
    }
  }, [showFeedback, isSubmitted, userAnswer, question.expectedAnswers]);

  const handleInputChange = (field: string, value: string) => {
    if (isSubmitted) return;
    
    const numericValue = value.replace(/[^\d.-]/g, '');
    setAnswers(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    const numericAnswers: Record<string, number> = {};
    let allFieldsCompleted = true;
    
    question.expectedAnswers?.forEach(expected => {
      const value = parseFloat(answers[expected.field] || '0');
      if (isNaN(value) || !answers[expected.field]) {
        allFieldsCompleted = false;
      }
      numericAnswers[expected.field] = value;
    });
    
    if (!allFieldsCompleted) {
      alert('Please complete all required fields before submitting.');
      return;
    }
    
    const isCorrect = question.expectedAnswers?.every(expected => {
      const actualValue = numericAnswers[expected.field];
      return AviationCalculations.validateAnswer(actualValue, expected.value, expected.tolerance);
    }) ?? false;
    
    const timeSpent = (new Date().getTime() - startTime.getTime()) / 1000;
    
    const answer: UserAnswer = {
      questionId: question.id,
      type: 'short_answer',
      shortAnswers: numericAnswers,
      isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    setIsSubmitted(true);
    onAnswerSubmit(answer);
  };

  const getInputStyle = (field: string) => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: spacing.radius.md,
      fontSize: '0.875rem',
      outline: 'none',
      backgroundColor: colors.white,
      transition: 'border-color 0.2s ease'
    };
    
    if (showFeedback && isSubmitted) {
      const validation = validationResults[field];
      if (validation) {
        if (validation.isCorrect) {
          baseStyle.borderColor = colors.semantic.success;
          baseStyle.backgroundColor = colors.withOpacity(colors.semantic.success, 0.05);
        } else {
          baseStyle.borderColor = colors.semantic.error;
          baseStyle.backgroundColor = colors.withOpacity(colors.semantic.error, 0.05);
        }
      }
    }
    
    if (isSubmitted) {
      baseStyle.cursor = 'not-allowed';
      baseStyle.opacity = 0.7;
    }
    
    return baseStyle;
  };

  if (!question.expectedAnswers || question.expectedAnswers.length === 0) {
    return <div style={{ color: colors.semantic.error }}>Error: No expected answers defined for short answer question</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
      {question.expectedAnswers.map((expected) => (
        <div key={expected.field} style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[2] }}>
          <label style={{ display: 'block' }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: colors.gray[700],
              marginBottom: spacing.scale[1],
              display: 'block'
            }}>
              {expected.description}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
              <input
                type="text"
                value={answers[expected.field] || ''}
                onChange={(e) => handleInputChange(expected.field, e.target.value)}
                style={getInputStyle(expected.field)}
                placeholder={`Enter value`}
                disabled={isSubmitted}
              />
              
              <span style={{
                fontSize: '0.875rem',
                color: colors.gray[500],
                minWidth: 0,
                flexShrink: 0
              }}>
                {expected.unit}
              </span>
            </div>
          </label>
          
          {showFeedback && isSubmitted && validationResults[expected.field] && (
            <div style={{
              padding: spacing.scale[3],
              backgroundColor: colors.gray[50],
              borderRadius: spacing.radius.lg,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.scale[2]
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.gray[800] }}>
                  Expected: {AviationCalculations.formatNumber(expected.value)} {expected.unit} 
                  <span style={{ color: colors.gray[500], fontWeight: 'normal' }}> (±{expected.tolerance})</span>
                </span>
                <span style={{
                  padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
                  borderRadius: spacing.radius.sm,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: validationResults[expected.field].isCorrect 
                    ? colors.withOpacity(colors.semantic.success, 0.1)
                    : colors.withOpacity(colors.semantic.error, 0.1),
                  color: validationResults[expected.field].isCorrect 
                    ? colors.semantic.success
                    : colors.semantic.error
                }}>
                  {validationResults[expected.field].isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              {!validationResults[expected.field].isCorrect && (
                <div style={{
                  fontSize: '0.875rem',
                  color: colors.semantic.error,
                  backgroundColor: colors.withOpacity(colors.semantic.error, 0.05),
                  padding: spacing.scale[2],
                  borderRadius: spacing.radius.sm,
                  border: `1px solid ${colors.withOpacity(colors.semantic.error, 0.2)}`
                }}>
                  Your answer: {AviationCalculations.formatNumber(validationResults[expected.field].actual)} {expected.unit}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.scale[6],
        paddingTop: spacing.scale[4],
        borderTop: `1px solid ${colors.gray[200]}`
      }}>
        <div style={{ fontSize: '0.875rem', color: colors.gray[600] }}>
          {question.expectedAnswers.length > 1 
            ? `Complete all ${question.expectedAnswers.length} fields and submit`
            : 'Enter your answer and submit'
          }
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </Button>
      </div>
      
      {showFeedback && isSubmitted && (
        <div style={{
          marginTop: spacing.scale[6],
          padding: spacing.scale[4],
          backgroundColor: colors.gray[50],
          borderRadius: spacing.radius.lg,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.scale[3]
          }}>
            <span style={{ fontWeight: 500, color: colors.gray[800] }}>Overall Result</span>
            <span style={{
              padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
              borderRadius: spacing.radius.sm,
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: Object.values(validationResults).every(v => v.isCorrect) 
                ? colors.withOpacity(colors.semantic.success, 0.1)
                : colors.withOpacity(colors.semantic.error, 0.1),
              color: Object.values(validationResults).every(v => v.isCorrect) 
                ? colors.semantic.success
                : colors.semantic.error
            }}>
              {Object.values(validationResults).every(v => v.isCorrect) ? '✓ Correct' : '✗ Incorrect'}
            </span>
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: colors.gray[600],
            backgroundColor: colors.white,
            padding: spacing.scale[3],
            borderRadius: spacing.radius.sm,
            border: `1px solid ${colors.gray[200]}`
          }}>
            Fields correct: {Object.values(validationResults).filter(v => v.isCorrect).length} / {Object.values(validationResults).length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortAnswerQuestion;