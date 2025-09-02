import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../design-system';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { databaseService } from '../services/database';
import { storageService } from '../utils/localStorage';
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion';
import ShortAnswerQuestion from '../components/questions/ShortAnswerQuestion';
import FlightPlanTable from '../components/flight-plan/FlightPlanTable';
import FuelPolicyModal from '../components/flight-plan/FuelPolicyModal';
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import type { Question, UserAnswer, QuestionCategory } from '../types';

const QuestionsPage: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const { user } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');
  const { filteredQuestions, loading } = useQuestions(categoryFilter);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'practice' | 'results'>('overview');
  
  // Modal states
  const [showFlightPlan, setShowFlightPlan] = useState(false);
  const [showFuelPolicy, setShowFuelPolicy] = useState(false);

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        if (user) {
          const progress = await databaseService.getUserProgress();
          if (progress) {
            setUserAnswers(progress);
          }
        } else {
          const localProgress = storageService.loadUserAnswers();
          setUserAnswers(localProgress);
        }
      } catch (error) {
        console.error('Failed to load user progress:', error);
      }
    };

    loadProgress();
  }, [user]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSubmit = async (answer: UserAnswer) => {
    setSessionAnswers(prev => [...prev, answer]);
    
    const updatedAnswers = [...userAnswers, answer];
    setUserAnswers(updatedAnswers);

    // Save progress
    if (user) {
      try {
        await databaseService.saveUserAnswer(answer);
      } catch (error) {
        console.error('Failed to save answer to database:', error);
        storageService.saveUserAnswers(updatedAnswers);
      }
    } else {
      storageService.saveUserAnswers(updatedAnswers);
    }

    // Move to next question or show results
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResults(true);
        setViewMode('results');
      }, 1500);
    }
  };

  const startPractice = () => {
    setViewMode('practice');
    setCurrentQuestionIndex(0);
    setSessionAnswers([]);
    setShowResults(false);
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setSessionAnswers([]);
    setShowResults(false);
    setViewMode('overview');
  };

  const handleOpenFlightPlan = () => {
    setShowFlightPlan(true);
  };

  const handleOpenFuelPolicy = () => {
    setShowFuelPolicy(true);
  };

  const renderQuestionByType = (question: Question) => {
    if (question.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuestion
          question={question}
          onAnswerSubmit={handleAnswerSubmit}
          onOpenFlightPlan={handleOpenFlightPlan}
          onOpenFuelPolicy={handleOpenFuelPolicy}
        />
      );
    } else if (question.type === 'short_answer') {
      return (
        <ShortAnswerQuestion
          question={question}
          onAnswerSubmit={handleAnswerSubmit}
          onOpenFlightPlan={handleOpenFlightPlan}
          onOpenFuelPolicy={handleOpenFuelPolicy}
        />
      );
    }
    return null;
  };

  // Define styles following FlightPlanTable patterns
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.scale[4]
  };

  const titleStyle: React.CSSProperties = {
    ...styles.heading,
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[2]
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.scale[2]
  };

  const metricsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: spacing.scale[4],
    marginBottom: spacing.scale[6]
  };

  const metricStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    padding: spacing.scale[3],
    background: colors.withOpacity(colors.aviation.primary, 0.05),
    borderRadius: spacing.radius.lg,
    border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: '2rem',
    height: '2rem',
    borderRadius: spacing.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.withOpacity(colors.aviation.primary, 0.1)
  };

  const metricTextStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  };

  const metricLabelStyle: React.CSSProperties = {
    ...styles.caption,
    color: colors.aviation.muted
  };

  const metricValueStyle: React.CSSProperties = {
    ...styles.body,
    fontWeight: 600,
    color: colors.aviation.navy
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: spacing.scale[4] }}>
        <Card variant="elevated" padding="lg">
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                border: `2px solid ${colors.aviation.primary}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
                marginBottom: spacing.scale[3]
              }} />
              <p style={{ ...styles.body, color: colors.aviation.text }}>
                Loading questions...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No questions available
  if (filteredQuestions.length === 0) {
    return (
      <div style={{ padding: spacing.scale[4] }}>
        <Card variant="elevated" padding="lg">
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: spacing.scale[4] }}>❓</div>
              <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[2] }}>
                No questions available
              </h2>
              <p style={{ ...styles.body, color: colors.aviation.muted, marginBottom: spacing.scale[4] }}>
                Questions for the selected category will be added soon.
              </p>
              {categoryFilter !== 'all' && (
                <SecondaryButton onClick={() => setCategoryFilter('all')}>
                  Show All Categories
                </SecondaryButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Practice mode
  if (viewMode === 'practice' && currentQuestion && !showResults) {
    return (
      <div style={{ padding: spacing.scale[4] }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          {/* Practice header */}
          <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
            <div style={headerStyle}>
              <div>
                <h1 style={titleStyle}>
                  <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary }} />
                  Practice Questions
                </h1>
                <p style={{ ...styles.caption, marginTop: spacing.scale[1] }}>
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </p>
              </div>
              <div style={buttonGroupStyle}>
                <SecondaryButton onClick={() => setViewMode('overview')}>
                  Back to Overview
                </SecondaryButton>
              </div>
            </div>
            
            {/* Progress bar */}
            <div style={{ 
              width: '100%', 
              background: colors.gray[200], 
              borderRadius: spacing.radius.full, 
              height: '0.5rem' 
            }}>
              <div
                style={{
                  width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                  background: colors.aviation.primary,
                  height: '0.5rem',
                  borderRadius: spacing.radius.full,
                  transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </Card>

          {/* Question */}
          {renderQuestionByType(currentQuestion)}

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
                  alignItems: 'center'
                }}>
                  <h2 style={{ ...styles.heading, margin: 0 }}>Interactive Flight Plan</h2>
                  <SecondaryButton onClick={() => setShowFlightPlan(false)}>
                    Close
                  </SecondaryButton>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <FlightPlanTable />
                </div>
              </div>
            </div>
          )}

          {/* Fuel Policy Modal */}
          <FuelPolicyModal
            isOpen={showFuelPolicy}
            onClose={() => setShowFuelPolicy(false)}
            totalTripFuel={0}
            flightPlanSegments={[]}
          />
        </div>
      </div>
    );
  }

  // Results mode
  if (viewMode === 'results') {
    const sessionStats = {
      correct: sessionAnswers.filter(a => a.isCorrect).length,
      total: sessionAnswers.length,
      accuracy: sessionAnswers.length > 0 ? (sessionAnswers.filter(a => a.isCorrect).length / sessionAnswers.length) * 100 : 0
    };

    return (
      <div style={{ padding: spacing.scale[4] }}>
        <Card variant="elevated" padding="lg">
          <CardContent>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: spacing.scale[4] }}>
                {sessionStats.accuracy >= 80 ? '🎉' : sessionStats.accuracy >= 60 ? '👍' : '📚'}
              </div>
              
              <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[4] }}>
                Practice Complete!
              </h2>
              
              <div style={metricsStyle}>
                <div style={metricStyle}>
                  <div style={iconWrapperStyle}>
                    <Target style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
                  </div>
                  <div style={metricTextStyle}>
                    <p style={metricLabelStyle}>Correct Answers</p>
                    <p style={metricValueStyle}>{sessionStats.correct}</p>
                  </div>
                </div>
                <div style={metricStyle}>
                  <div style={iconWrapperStyle}>
                    <BookOpen style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
                  </div>
                  <div style={metricTextStyle}>
                    <p style={metricLabelStyle}>Total Questions</p>
                    <p style={metricValueStyle}>{sessionStats.total}</p>
                  </div>
                </div>
                <div style={metricStyle}>
                  <div style={iconWrapperStyle}>
                    <TrendingUp style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
                  </div>
                  <div style={metricTextStyle}>
                    <p style={metricLabelStyle}>Accuracy</p>
                    <p style={metricValueStyle}>{sessionStats.accuracy.toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              <div style={buttonGroupStyle}>
                <PrimaryButton onClick={startPractice}>
                  Practice Again
                </PrimaryButton>
                <SecondaryButton onClick={resetSession}>
                  Back to Overview
                </SecondaryButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Overview mode (default)
  const stats = {
    totalQuestions: filteredQuestions.length,
    attemptedQuestions: userAnswers.filter(answer => 
      filteredQuestions.some(q => q.id === answer.questionId)
    ).length,
    correctAnswers: userAnswers.filter(answer => 
      filteredQuestions.some(q => q.id === answer.questionId) && answer.isCorrect
    ).length,
    accuracy: 0
  };
  stats.accuracy = stats.attemptedQuestions > 0 ? (stats.correctAnswers / stats.attemptedQuestions) * 100 : 0;

  const categories: Array<{ value: QuestionCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'performance', label: 'Performance' },
    { value: 'navigation', label: 'Navigation' },
    { value: 'fuel_planning', label: 'Fuel Planning' },
    { value: 'weight_balance', label: 'Weight & Balance' },
    { value: 'weather', label: 'Weather' },
    { value: 'emergency_procedures', label: 'Emergency Procedures' }
  ];

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Header */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
          <div style={headerStyle}>
            <div>
              <h1 style={titleStyle}>
                <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary }} />
                Practice Questions
              </h1>
              <p style={{ ...styles.caption, marginTop: spacing.scale[1] }}>
                Test your ATPL knowledge with aviation questions
              </p>
            </div>
            <div style={buttonGroupStyle}>
              <PrimaryButton onClick={startPractice}>
                Start Practice
              </PrimaryButton>
            </div>
          </div>

          {/* Category filter */}
          <div style={{ marginBottom: spacing.scale[4] }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: colors.aviation.navy, 
              marginBottom: spacing.scale[2] 
            }}>
              Filter by Category:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as QuestionCategory | 'all')}
              style={{
                padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                border: `1px solid ${colors.aviation.border}`,
                borderRadius: spacing.radius.md,
                background: colors.white,
                color: colors.aviation.navy,
                fontSize: '0.875rem',
                minWidth: '200px',
                outline: 'none'
              }}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Key Metrics */}
          <div style={metricsStyle}>
            <div style={metricStyle}>
              <div style={iconWrapperStyle}>
                <BookOpen style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Total Questions</p>
                <p style={metricValueStyle}>{stats.totalQuestions}</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={iconWrapperStyle}>
                <Target style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Attempted</p>
                <p style={metricValueStyle}>{stats.attemptedQuestions}</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={iconWrapperStyle}>
                <Award style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Correct</p>
                <p style={metricValueStyle}>{stats.correctAnswers}</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={iconWrapperStyle}>
                <TrendingUp style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Accuracy</p>
                <p style={metricValueStyle}>{stats.accuracy.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress indicator if user has attempted questions */}
        {stats.attemptedQuestions > 0 && (
          <Card variant="default" padding="lg">
            <CardHeader title="Overall Progress" />
            <CardContent>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: spacing.scale[2] 
              }}>
                <span style={{ ...styles.body, fontWeight: 500, color: colors.aviation.navy }}>
                  Progress
                </span>
                <span style={{ ...styles.caption, color: colors.aviation.muted }}>
                  {stats.attemptedQuestions}/{stats.totalQuestions} questions
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                background: colors.gray[200], 
                borderRadius: spacing.radius.full, 
                height: '0.5rem' 
              }}>
                <div
                  style={{
                    width: `${(stats.attemptedQuestions / stats.totalQuestions) * 100}%`,
                    background: colors.aviation.primary,
                    height: '0.5rem',
                    borderRadius: spacing.radius.full,
                    transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;