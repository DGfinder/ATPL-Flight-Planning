import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';
import MultipleChoiceQuestion from '../questions/MultipleChoiceQuestion';
import ShortAnswerQuestion from '../questions/ShortAnswerQuestion';
import type { 
  ExamResult
} from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { ExamSessionManager } from '../../services/examService';

interface QuestionReviewProps {
  result: ExamResult;
  onBackToResults: () => void;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  result,
  onBackToResults
}) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanations, setShowExplanations] = useState(true);

  const currentQuestion = result.exam.questions[currentIndex];
  const userAnswer = result.examSession.answers[currentQuestion.id];
  const isCorrect = userAnswer ? ExamSessionManager.validateAnswer(currentQuestion, userAnswer) : false;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < result.exam.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleAnswerSubmit = () => {
    // Read-only mode - no submission allowed
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.gray[50],
      padding: spacing.scale[4]
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.scale[4]
          }}>
            <div>
              <h1 style={{
                ...styles.heading,
                fontSize: '1.5rem',
                color: colors.aviation.navy,
                marginBottom: spacing.scale[1]
              }}>
                Question Review
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: colors.aviation.muted
              }}>
                Exam Scenario {result.exam.scenario} • Seed: {result.exam.seed}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: spacing.scale[2] }}>
              <SecondaryButton
                onClick={() => setShowExplanations(!showExplanations)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
              >
                {showExplanations ? (
                  <EyeOff style={{ width: '1rem', height: '1rem' }} />
                ) : (
                  <Eye style={{ width: '1rem', height: '1rem' }} />
                )}
                {showExplanations ? 'Hide' : 'Show'} Explanations
              </SecondaryButton>
              
              <SecondaryButton onClick={onBackToResults}>
                Back to Results
              </SecondaryButton>
            </div>
          </div>

          {/* Question Navigator */}
          <div style={{
            display: 'flex',
            gap: spacing.scale[1],
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {result.exam.questions.map((question, index) => {
              const answer = result.examSession.answers[question.id];
              const correct = answer ? ExamSessionManager.validateAnswer(question, answer) : false;
              const answered = answer !== undefined;
              
              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(index)}
                  style={{
                    padding: spacing.scale[2],
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: spacing.radius.md,
                    border: currentIndex === index ? 
                      `2px solid ${colors.aviation.primary}` : 
                      `1px solid ${colors.gray[300]}`,
                    background: !answered ? colors.gray[100] :
                               correct ? colors.withOpacity(colors.semantic.success, 0.1) :
                               colors.withOpacity(colors.semantic.error, 0.1),
                    color: currentIndex === index ? colors.aviation.primary :
                           !answered ? colors.aviation.muted :
                           correct ? colors.semantic.success :
                           colors.semantic.error,
                    fontSize: '0.875rem',
                    fontWeight: currentIndex === index ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Current Question */}
        <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.scale[4],
            paddingBottom: spacing.scale[3],
            borderBottom: `1px solid ${colors.gray[200]}`
          }}>
            <div>
              <h2 style={{
                ...styles.heading,
                fontSize: '1.25rem',
                color: colors.aviation.navy,
                marginBottom: spacing.scale[1]
              }}>
                Question {currentIndex + 1} of {result.exam.questions.length}
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[3],
                fontSize: '0.875rem'
              }}>
                <span style={{ color: colors.aviation.muted }}>
                  {currentQuestion.marks} mark{currentQuestion.marks > 1 ? 's' : ''}
                </span>
                <span style={{ color: colors.aviation.muted }}>
                  {currentQuestion.category.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2],
              padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
              borderRadius: spacing.radius.md,
              background: isCorrect ? 
                colors.withOpacity(colors.semantic.success, 0.1) :
                userAnswer ? colors.withOpacity(colors.semantic.error, 0.1) :
                colors.withOpacity(colors.gray[200], 0.5),
              border: `1px solid ${isCorrect ? 
                colors.withOpacity(colors.semantic.success, 0.3) :
                userAnswer ? colors.withOpacity(colors.semantic.error, 0.3) :
                colors.gray[300]}`
            }}>
              {isCorrect ? (
                <CheckCircle style={{ width: '1rem', height: '1rem', color: colors.semantic.success }} />
              ) : userAnswer ? (
                <XCircle style={{ width: '1rem', height: '1rem', color: colors.semantic.error }} />
              ) : (
                <div style={{ width: '1rem', height: '1rem', background: colors.gray[400], borderRadius: '50%' }} />
              )}
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isCorrect ? colors.semantic.success :
                       userAnswer ? colors.semantic.error :
                       colors.aviation.muted
              }}>
                {!userAnswer ? 'No Answer' : isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          </div>

          <CardContent>
            {currentQuestion.type === 'multiple_choice' ? (
              <MultipleChoiceQuestion
                question={currentQuestion}
                onAnswerSubmit={handleAnswerSubmit}
                userAnswer={userAnswer}
                showFeedback={showExplanations}
              />
            ) : (
              <ShortAnswerQuestion
                question={currentQuestion}
                onAnswerSubmit={handleAnswerSubmit}
                userAnswer={userAnswer}
                showFeedback={showExplanations}
              />
            )}

            {/* Answer Reference */}
            {showExplanations && currentQuestion.reference && (
              <div style={{
                marginTop: spacing.scale[4],
                padding: spacing.scale[4],
                background: colors.withOpacity(colors.aviation.secondary, 0.05),
                borderRadius: spacing.radius.md,
                border: `1px solid ${colors.withOpacity(colors.aviation.secondary, 0.2)}`
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  marginBottom: spacing.scale[2]
                }}>
                  Reference
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: colors.aviation.text,
                  fontStyle: 'italic'
                }}>
                  {currentQuestion.reference}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.scale[6]
        }}>
          <SecondaryButton
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2]
            }}
          >
            <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
            Previous
          </SecondaryButton>

          <div style={{
            fontSize: '0.875rem',
            color: colors.aviation.muted,
            textAlign: 'center'
          }}>
            Question {currentIndex + 1} of {result.exam.questions.length}
          </div>

          <SecondaryButton
            onClick={goToNext}
            disabled={currentIndex === result.exam.questions.length - 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2]
            }}
          >
            Next
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </SecondaryButton>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center' }}>
          <PrimaryButton
            onClick={onBackToResults}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2],
              margin: '0 auto'
            }}
          >
            Return to Results
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default QuestionReview;