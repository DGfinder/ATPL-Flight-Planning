import React, { useState } from 'react';
import type { Question, UserAnswer } from '../../types';
import { Button, useDesignSystem } from '../../design-system';
import { Plane, Fuel } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswerSubmit: (answer: UserAnswer) => void;
  showFeedback?: boolean;
  userAnswer?: UserAnswer;
  onOpenFlightPlan?: () => void;
  onOpenFuelPolicy?: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswerSubmit,
  showFeedback = false,
  userAnswer,
  onOpenFlightPlan,
  onOpenFuelPolicy
}) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [selectedOption, setSelectedOption] = useState<number | null>(
    userAnswer?.multipleChoiceAnswer ?? null
  );
  const [startTime] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(userAnswer !== undefined);

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
      // Clean up key names for display
      const displayKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/\s+/g, ' ') // Clean up multiple spaces
        .trim();
      
      return { key: displayKey, value: value.toString() };
    });
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    
    const isCorrect = selectedOption === question.correctAnswer;
    const timeSpent = (new Date().getTime() - startTime.getTime()) / 1000;
    
    const answer: UserAnswer = {
      questionId: question.id,
      type: 'multiple_choice',
      multipleChoiceAnswer: selectedOption,
      isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    setIsSubmitted(true);
    onAnswerSubmit(answer);
  };

  const getOptionStyle = (optionIndex: number) => {
    const baseStyle: React.CSSProperties = {
      padding: spacing.scale[4],
      borderRadius: spacing.radius.lg,
      cursor: isSubmitted ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
      border: `2px solid ${selectedOption === optionIndex ? colors.aviation.primary : colors.gray[200]}`,
      backgroundColor: colors.white,
      marginBottom: spacing.scale[3]
    };
    
    if (selectedOption === optionIndex) {
      baseStyle.backgroundColor = colors.withOpacity(colors.aviation.primary, 0.05);
      baseStyle.borderColor = colors.aviation.primary;
    }
    
    if (showFeedback && isSubmitted) {
      if (optionIndex === question.correctAnswer) {
        baseStyle.backgroundColor = colors.withOpacity(colors.semantic.success, 0.05);
        baseStyle.borderColor = colors.semantic.success;
      } else if (selectedOption === optionIndex && optionIndex !== question.correctAnswer) {
        baseStyle.backgroundColor = colors.withOpacity(colors.semantic.error, 0.05);
        baseStyle.borderColor = colors.semantic.error;
      }
    }
    
    return baseStyle;
  };

  if (!question.options) {
    return <div style={{ color: colors.semantic.error }}>Error: No options provided for multiple choice question</div>;
  }

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

      {/* Answer Options */}
      {question.options.map((option, index) => (
        <div
          key={index}
          style={getOptionStyle(index)}
          onClick={() => handleOptionSelect(index)}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginRight: spacing.scale[3], marginTop: '0.125rem' }}>
              <div style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                border: `2px solid ${
                  selectedOption === index 
                    ? colors.aviation.primary 
                    : colors.gray[300]
                }`,
                backgroundColor: selectedOption === index ? colors.aviation.primary : colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedOption === index && (
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: colors.white }}></div>
                )}
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem', color: colors.gray[600], marginRight: spacing.scale[2] }}>
                {String.fromCharCode(65 + index)}.
              </span>
              <span style={{ color: colors.gray[900] }}>{option}</span>
              
              {showFeedback && isSubmitted && (
                <div style={{ marginTop: spacing.scale[2] }}>
                  {index === question.correctAnswer && (
                    <div style={{ display: 'flex', alignItems: 'center', color: colors.semantic.success, fontSize: '0.875rem' }}>
                      <span style={{ marginRight: spacing.scale[1] }}>✓</span>
                      <span style={{ fontWeight: 500 }}>Correct Answer</span>
                    </div>
                  )}
                  {selectedOption === index && index !== question.correctAnswer && (
                    <div style={{ display: 'flex', alignItems: 'center', color: colors.semantic.error, fontSize: '0.875rem' }}>
                      <span style={{ marginRight: spacing.scale[1] }}>✗</span>
                      <span style={{ fontWeight: 500 }}>Your Answer</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
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
        <div style={{ fontSize: '0.875rem', color: colors.gray[600] }}>
          Select your answer and click submit
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedOption === null || isSubmitted}
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
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
                The correct answer is <strong>{String.fromCharCode(65 + (question.correctAnswer ?? 0))}</strong>: {question.options?.[question.correctAnswer ?? 0]}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;