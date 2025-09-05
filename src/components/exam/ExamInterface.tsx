import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';
import ExamTimer from '../ui/ExamTimer';
import MultipleChoiceQuestion from '../questions/MultipleChoiceQuestion';
import ShortAnswerQuestion from '../questions/ShortAnswerQuestion';
import FlightPlanTable from '../flight-plan/FlightPlanTable';
// import FuelPolicyModal from '../flight-plan/FuelPolicyModal';
import { ExamSessionManager } from '../../services/examService';
import type { 
  TrialExam, 
  ExamSession, 
  UserAnswer, 
  ExamQuestion,
  FlightPlanData
} from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Navigation,
  Fuel,
  CheckCircle
} from 'lucide-react';

interface ExamInterfaceProps {
  exam: TrialExam;
  onExamComplete: (session: ExamSession) => void;
  onExitExam: () => void;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({
  exam,
  onExamComplete,
  onExitExam
}) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ExamQuestion | null>(null);
  const [showFlightPlan, setShowFlightPlan] = useState(false);
  const [showFuelPolicy, setShowFuelPolicy] = useState(false);
  const [flightPlanData, setFlightPlanData] = useState<FlightPlanData | null>(null);

  // Initialize exam session
  useEffect(() => {
    const existingSession = ExamSessionManager.loadSession();
    
    if (existingSession && existingSession.examId === exam.id && !existingSession.isCompleted) {
      // Resume existing session
      setSession(existingSession);
      setCurrentQuestion(exam.questions[existingSession.currentQuestionIndex]);
    } else {
      // Create new session
      const newSession = ExamSessionManager.createSession(exam);
      setSession(newSession);
      setCurrentQuestion(exam.questions[0]);
    }
  }, [exam]);

  // Update timer every second
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const updated = ExamSessionManager.updateTimeSpent(session);
      setSession(updated);

      // Check if exam has expired
      if (ExamSessionManager.isSessionExpired(updated, exam)) {
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, exam]);

  const handleTimeUp = useCallback(() => {
    if (!session) return;
    
    // Auto-submit exam when time is up
    const completedSession = ExamSessionManager.completeSession(session);
    setSession(completedSession);
    onExamComplete(completedSession);
  }, [session, onExamComplete]);

  const handleAnswerSubmit = async (answer: UserAnswer) => {
    if (!session || !currentQuestion) return;
    
    try {
      // Save answer to session
      const updatedSession = ExamSessionManager.submitAnswer(session, currentQuestion.id, answer);
      setSession(updatedSession);
      
      // Auto-advance to next question after a brief delay
      setTimeout(() => {
        goToNextQuestion();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const goToQuestion = (index: number) => {
    if (!session || index < 0 || index >= exam.questions.length) return;
    
    const updatedSession = ExamSessionManager.updateCurrentQuestion(session, index);
    setSession(updatedSession);
    setCurrentQuestion(exam.questions[index]);
  };

  const goToPreviousQuestion = () => {
    if (!session) return;
    goToQuestion(session.currentQuestionIndex - 1);
  };

  const goToNextQuestion = () => {
    if (!session) return;
    goToQuestion(session.currentQuestionIndex + 1);
  };

  const handleSubmitExam = () => {
    if (!session) return;
    
    const completedSession = ExamSessionManager.completeSession(session);
    setSession(completedSession);
    onExamComplete(completedSession);
  };

  const handleFlightPlanDataChange = (newData: FlightPlanData) => {
    setFlightPlanData(newData);
    // Save flight plan data associated with current question
    if (currentQuestion) {
      try {
        localStorage.setItem(`flightPlan-${session?.id}-${currentQuestion.id}`, JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save flight plan data:', error);
      }
    }
  };

  // Load flight plan data for current question
  useEffect(() => {
    if (currentQuestion && session) {
      try {
        const savedData = localStorage.getItem(`flightPlan-${session.id}-${currentQuestion.id}`);
        if (savedData) {
          setFlightPlanData(JSON.parse(savedData));
        } else {
          setFlightPlanData(null);
        }
      } catch (error) {
        console.error('Failed to load flight plan data:', error);
        setFlightPlanData(null);
      }
    }
  }, [currentQuestion, session]);

  if (!session || !currentQuestion) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: colors.aviation.muted
      }}>
        Loading exam...
      </div>
    );
  }

  const remainingTime = ExamSessionManager.getRemainingTime(session, exam);
  const isAnswered = session.answers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(session.answers).length;
  const isLastQuestion = session.currentQuestionIndex === exam.questions.length - 1;

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.gray[50],
      padding: spacing.scale[4]
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Exam Header */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: spacing.scale[4]
          }}>
            {/* Question Counter */}
            <div>
              <h1 style={{
                ...styles.heading,
                fontSize: '1.25rem',
                color: colors.aviation.navy,
                marginBottom: spacing.scale[1]
              }}>
                Question {session.currentQuestionIndex + 1} of {exam.totalQuestions}
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[3],
                fontSize: '0.875rem',
                color: colors.aviation.muted
              }}>
                <span>
                  <CheckCircle style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: spacing.scale[1] }} />
                  {answeredCount} answered
                </span>
                <span>
                  <FileText style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: spacing.scale[1] }} />
                  {currentQuestion.marks} mark{currentQuestion.marks > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[3]
            }}>
              <ExamTimer 
                endTime={new Date(Date.now() + remainingTime * 1000)}
                onExpire={handleTimeUp}
              />
              
              <SecondaryButton
                onClick={onExitExam}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
              >
                Exit Exam
              </SecondaryButton>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            marginTop: spacing.scale[4],
            background: colors.gray[200],
            borderRadius: spacing.radius.md,
            height: '8px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${((session.currentQuestionIndex + 1) / exam.totalQuestions) * 100}%`,
                height: '100%',
                background: colors.aviation.primary,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </Card>

        {/* Interactive Tools */}
        <Card variant="default" padding="md" style={{ marginBottom: spacing.scale[4] }}>
          <div style={{
            display: 'flex',
            gap: spacing.scale[2],
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: colors.aviation.navy,
              marginRight: spacing.scale[2]
            }}>
              Tools:
            </span>
            
            <SecondaryButton
              onClick={() => setShowFlightPlan(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2],
                fontSize: '0.875rem'
              }}
            >
              <Navigation style={{ width: '1rem', height: '1rem' }} />
              Flight Plan
            </SecondaryButton>
            
            <SecondaryButton
              onClick={() => setShowFuelPolicy(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2],
                fontSize: '0.875rem'
              }}
            >
              <Fuel style={{ width: '1rem', height: '1rem' }} />
              Fuel Policy
            </SecondaryButton>
          </div>
        </Card>

        {/* Question Display */}
        <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
          <CardHeader 
            title={`Question ${session.currentQuestionIndex + 1}`}
            subtitle={`${currentQuestion.marks} mark${currentQuestion.marks > 1 ? 's' : ''} • ${currentQuestion.category.replace(/_/g, ' ').toUpperCase()}`}
          />
          <CardContent>
            {currentQuestion.type === 'multiple_choice' ? (
              <MultipleChoiceQuestion
                question={currentQuestion}
                onAnswerSubmit={handleAnswerSubmit}
                userAnswer={session.answers[currentQuestion.id]}
                showFeedback={false}
                hideInteractiveTools={true}
              />
            ) : (
              <ShortAnswerQuestion
                question={currentQuestion}
                onAnswerSubmit={handleAnswerSubmit}
                userAnswer={session.answers[currentQuestion.id]}
                showFeedback={false}
                hideInteractiveTools={true}
              />
            )}
            
            {isAnswered && (
              <div style={{
                marginTop: spacing.scale[4],
                padding: spacing.scale[3],
                background: colors.withOpacity(colors.semantic.success, 0.1),
                borderRadius: spacing.radius.md,
                border: `1px solid ${colors.withOpacity(colors.semantic.success, 0.2)}`,
                color: colors.semantic.success,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2],
                fontSize: '0.875rem'
              }}>
                <CheckCircle style={{ width: '1rem', height: '1rem' }} />
                Answer submitted for Question {session.currentQuestionIndex + 1}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.scale[8]
        }}>
          <SecondaryButton
            onClick={goToPreviousQuestion}
            disabled={session.currentQuestionIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2]
            }}
          >
            <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
            Previous
          </SecondaryButton>

          {isLastQuestion ? (
            <PrimaryButton
              onClick={handleSubmitExam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2],
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Submit Exam
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={goToNextQuestion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2]
              }}
            >
              Next
              <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            </PrimaryButton>
          )}
        </div>

        {/* Flight Plan Modal */}
        {showFlightPlan && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              width: '95vw',
              height: '95vh',
              background: colors.white,
              borderRadius: spacing.radius.lg,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: spacing.scale[4],
                borderBottom: `1px solid ${colors.gray[200]}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: colors.gray[50]
              }}>
                <div>
                  <h2 style={{
                    ...styles.heading,
                    fontSize: '1.25rem',
                    color: colors.aviation.primary,
                    margin: 0
                  }}>
                    Interactive Flight Planning
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    color: colors.aviation.muted,
                    margin: 0,
                    marginTop: spacing.scale[1]
                  }}>
                    Question {session.currentQuestionIndex + 1} - {currentQuestion.category.replace(/_/g, ' ')}
                  </p>
                </div>
                <SecondaryButton
                  onClick={() => setShowFlightPlan(false)}
                >
                  Close
                </SecondaryButton>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <FlightPlanTable 
                  questionContext={currentQuestion}
                  initialData={flightPlanData ?? undefined}
                  onDataChange={handleFlightPlanDataChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fuel Policy Modal */}
        {showFuelPolicy && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              width: '90vw',
              maxWidth: '600px',
              background: colors.white,
              borderRadius: spacing.radius.lg,
              padding: spacing.scale[6]
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.scale[4]
              }}>
                <h2 style={{
                  ...styles.heading,
                  fontSize: '1.25rem',
                  color: colors.aviation.primary,
                  margin: 0
                }}>
                  Fuel Policy Calculator
                </h2>
                <SecondaryButton
                  onClick={() => setShowFuelPolicy(false)}
                >
                  Close
                </SecondaryButton>
              </div>
              <p style={{
                ...styles.body,
                color: colors.aviation.muted,
                textAlign: 'center',
                padding: spacing.scale[4]
              }}>
                Fuel policy calculations for Question {session.currentQuestionIndex + 1}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamInterface;