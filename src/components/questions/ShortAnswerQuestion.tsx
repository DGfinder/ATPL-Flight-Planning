import React, { useState, useEffect } from 'react';
import type { Question, UserAnswer } from '../../types';
import { AviationCalculations } from '../../utils/aviationCalculations';
import { Button, useDesignSystem } from '../../design-system';
import { Plane, Fuel } from 'lucide-react';

interface ShortAnswerQuestionProps {
  question: Question;
  onAnswerSubmit: (answer: UserAnswer) => void;
  showFeedback?: boolean;
  userAnswer?: UserAnswer;
  onOpenFlightPlan?: () => void;
  onOpenFuelPolicy?: () => void;
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
  userAnswer,
  onOpenFlightPlan,
  onOpenFuelPolicy
}) => {
  const { colors, spacing, styles } = useDesignSystem();
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

  // Format question text for better readability
  const formatQuestionText = (text: string) => {
    if (!text) return '';
    
    // Split by common aviation separators and format
    return text
      .split(/(?<=\.)\s+/)
      .map((sentence, index) => (
        <React.Fragment key={index}>
          {sentence.trim()}
          {index < text.split(/(?<=\.)\s+/).length - 1 && <br />}
        </React.Fragment>
      ));
  };

  // Format given data for better display
  const formatGivenData = (data: Record<string, any>) => {
    return Object.entries(data).map(([key, value]) => {
      // Clean up key names for display while preserving aviation abbreviations
      const displayKey = key
        .replace(/([A-Z])([A-Z])/g, '$1 $2') // Add space between consecutive capitals (but not for single letters)
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/\s+/g, ' ') // Clean up multiple spaces
        .trim();
      
      return { key: displayKey, value: value.toString() };
    });
  };

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
    
    // Allow numbers, decimal points, and negative signs
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
      {/* Question Text */}
      <div style={{
        padding: spacing.scale[4],
        background: colors.withOpacity(colors.aviation.primary, 0.05),
        borderRadius: spacing.radius.lg,
        border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`,
        marginBottom: spacing.scale[4]
      }}>
        <h3 style={{ 
          ...styles.heading, 
          fontSize: '1.125rem', 
          marginBottom: spacing.scale[2],
          color: colors.aviation.navy 
        }}>
          {question.title}
        </h3>
        <p style={{ 
          ...styles.body, 
          color: colors.aviation.text,
          lineHeight: '1.6'
        }}>
          {formatQuestionText(question.description)}
        </p>
        
        {/* Given Data Section */}
        {Object.keys(question.givenData).length > 0 && (
          <div style={{ 
            marginTop: spacing.scale[3],
            padding: spacing.scale[3],
            background: colors.white,
            borderRadius: spacing.radius.md,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <h4 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: colors.aviation.navy,
              marginBottom: spacing.scale[2]
            }}>
              Given:
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing.scale[2],
              fontSize: '0.875rem'
            }}>
              {formatGivenData(question.givenData).map(({ key, value }) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: spacing.scale[1],
                  background: colors.gray[50],
                  borderRadius: spacing.radius.sm
                }}>
                  <span style={{ fontWeight: 500, color: colors.aviation.navy }}>{key}:</span>
                  <span style={{ color: colors.aviation.text }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Fields */}
      <div style={{
        padding: spacing.scale[4],
        background: colors.white,
        borderRadius: spacing.radius.lg,
        border: `1px solid ${colors.gray[200]}`,
        marginBottom: spacing.scale[4]
      }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          color: colors.aviation.navy,
          marginBottom: spacing.scale[2]
        }}>
          Your Answer:
        </h4>
        <p style={{
          fontSize: '0.75rem',
          color: colors.aviation.text,
          fontStyle: 'italic',
          marginBottom: spacing.scale[3],
          opacity: 0.8
        }}>
          Enter your answer here
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
          {question.expectedAnswers?.map((expected) => (
            <div key={expected.field} style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[2] }}>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: 500, 
                color: colors.aviation.navy 
              }}>
                {expected.description || expected.field} ({expected.unit}):
              </label>
              <input
                type="text"
                value={answers[expected.field] || ''}
                onChange={(e) => handleInputChange(expected.field, e.target.value)}
                disabled={isSubmitted}
                style={{
                  padding: spacing.scale[3],
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: spacing.radius.md,
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: isSubmitted ? colors.gray[100] : colors.white,
                  width: '100%',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder={`Enter your answer here (${expected.unit})`}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.aviation.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.gray[300];
                }}
              />
              
              {showFeedback && isSubmitted && validationResults[expected.field] && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: spacing.scale[2],
                  fontSize: '0.875rem',
                  color: validationResults[expected.field].isCorrect ? colors.semantic.success : colors.semantic.error
                }}>
                  <span>{validationResults[expected.field].isCorrect ? '✓' : '✗'}</span>
                  <span>
                    Expected: {validationResults[expected.field].expected} {expected.unit} 
                    (Tolerance: ±{expected.tolerance} {expected.unit})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tools Section */}
      <div style={{
        marginTop: spacing.scale[4],
        padding: spacing.scale[3],
        background: colors.withOpacity(colors.aviation.secondary, 0.05),
        borderRadius: spacing.radius.lg,
        border: `1px solid ${colors.withOpacity(colors.aviation.secondary, 0.1)}`
      }}>
        <h4 style={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          color: colors.aviation.navy,
          marginBottom: spacing.scale[2]
        }}>
          Interactive Tools:
        </h4>
        <div style={{ 
          display: 'flex', 
          gap: spacing.scale[2],
          flexWrap: 'wrap'
        }}>
          <Button
            variant="secondary"
            onClick={onOpenFlightPlan}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2],
              fontSize: '0.875rem'
            }}
          >
            <Plane style={{ width: '1rem', height: '1rem' }} />
            Flight Plan
          </Button>
          <Button
            variant="secondary"
            onClick={onOpenFuelPolicy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2],
              fontSize: '0.875rem'
            }}
          >
            <Fuel style={{ width: '1rem', height: '1rem' }} />
            Fuel Policy
          </Button>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.scale[6] }}>
        <div style={{ fontSize: '0.875rem', color: colors.aviation.text, opacity: 0.8 }}>
          Complete all fields above and click submit
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitted}
          style={{
            minWidth: '120px',
            fontWeight: 600
          }}
        >
          {isSubmitted ? 'Submitted ✓' : 'Submit Answer'}
        </Button>
      </div>
      
      {showFeedback && isSubmitted && (
        <div style={{ 
          marginTop: spacing.scale[4], 
          padding: spacing.scale[4], 
          backgroundColor: colors.gray[50], 
          borderRadius: spacing.radius.lg 
        }}>
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.scale[2] }}>
              <span style={{ fontWeight: 500 }}>Result:</span>
              <span style={{
                marginLeft: spacing.scale[2],
                color: userAnswer?.isCorrect ? colors.semantic.success : colors.semantic.error
              }}>
                {userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            
            {!userAnswer?.isCorrect && (
              <div style={{ color: colors.gray[700] }}>
                Please check your calculations and try again.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortAnswerQuestion;