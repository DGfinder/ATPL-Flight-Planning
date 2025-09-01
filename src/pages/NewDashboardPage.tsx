import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  InteractiveCard,
  GradientCard,
  SecondaryButton,
  useDesignSystem
} from '../design-system';
import type { Question, UserAnswer, QuestionCategory, PerformanceMetrics } from '../types';
import { sampleQuestions, questionCategories } from '../data/questions';
import { storageService } from '../utils/localStorage';
import { databaseService } from '../services/database';
import { useAuth } from '../hooks/useAuth';

// Icons components for better maintenance
const AirplaneIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const QuestionIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '0.5rem', transition: 'transform 0.2s ease' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

/**
 * Dashboard Action Card Component
 */
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'featured';
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  variant = 'default' 
}) => {
  const { colors, spacing, styles } = useDesignSystem();

  const iconWrapperStyle: React.CSSProperties = {
    width: '2rem',
    height: '2rem',
    borderRadius: spacing.radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.withOpacity(colors.aviation.primary, 0.1)} 0%, ${colors.withOpacity(colors.aviation.primary, 0.05)} 100%)`,
    color: colors.aviation.primary,
    marginBottom: spacing.scale[3],
    transition: 'all 300ms ease'
  };

  const titleStyle: React.CSSProperties = {
    ...styles.heading,
    fontSize: '1.125rem',
    marginBottom: spacing.scale[2],
    lineHeight: 1.5
  };

  const descriptionStyle: React.CSSProperties = {
    ...styles.body,
    fontSize: '0.875rem',
    marginBottom: spacing.scale[4]
  };

  const ctaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.aviation.primary
  };

  return (
    <InteractiveCard 
      padding="lg" 
      onClick={onClick}
    >
      <div style={iconWrapperStyle}>
        {icon}
      </div>
      
      {variant === 'featured' && (
        <div style={{
          position: 'absolute',
          top: '-0.25rem',
          right: '-0.25rem',
          width: '1.25rem',
          height: '1.25rem',
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <StarIcon />
        </div>
      )}
      
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      
      <div style={ctaStyle}>
        <span>Start {title === 'Trial Exam' ? 'Exam' : title === 'Course Notes' ? 'Reading' : title === 'Practice Questions' ? 'Practice' : title === 'Flight Planning' ? 'Planning' : 'Analytics'}</span>
        <ArrowRightIcon />
      </div>
    </InteractiveCard>
  );
};

/**
 * Progress Metric Component
 */
interface ProgressMetricProps {
  label: string;
  value: string | number;
  color: 'primary' | 'secondary' | 'navy' | 'muted';
}

const ProgressMetric: React.FC<ProgressMetricProps> = ({ label, value, color }) => {
  const { colors, spacing, styles } = useDesignSystem();
  
  const colorMap = {
    primary: colors.aviation.primary,
    secondary: colors.aviation.secondary,
    navy: colors.aviation.navy,
    muted: colors.aviation.muted
  };

  const metricStyle: React.CSSProperties = {
    textAlign: 'center'
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 700,
    color: colorMap[color],
    lineHeight: 1.2,
    marginBottom: spacing.scale[1]
  };

  const labelStyle: React.CSSProperties = {
    ...styles.caption,
    lineHeight: 1.4
  };

  return (
    <div style={metricStyle}>
      <div style={valueStyle}>{value}</div>
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

/**
 * Recent Activity Item Component
 */
interface ActivityItemProps {
  question: Question;
  answer: UserAnswer;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ question, answer }) => {
  const { colors, spacing, styles } = useDesignSystem();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.scale[4],
    background: `linear-gradient(135deg, ${colors.withOpacity(colors.aviation.light, 0.5)} 0%, ${colors.white} 100%)`,
    borderRadius: spacing.radius.lg,
    border: `1px solid ${colors.gray[200]}`,
    transition: 'all 200ms ease'
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[4],
    flex: 1,
    minWidth: 0
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: '2rem',
    height: '2rem',
    borderRadius: spacing.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: answer.isCorrect 
      ? `linear-gradient(135deg, ${colors.withOpacity(colors.aviation.secondary, 0.1)} 0%, ${colors.withOpacity(colors.aviation.secondary, 0.05)} 100%)`
      : `linear-gradient(135deg, ${colors.withOpacity(colors.semantic.error, 0.1)} 0%, ${colors.withOpacity(colors.semantic.error, 0.05)} 100%)`,
    color: answer.isCorrect ? colors.aviation.secondary : colors.semantic.error
  };

  const textSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0
  };

  const titleStyle: React.CSSProperties = {
    ...styles.body,
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: spacing.scale[1],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const subtitleStyle: React.CSSProperties = {
    ...styles.caption,
    textTransform: 'capitalize'
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
    borderRadius: '9999px',
    background: answer.isCorrect 
      ? colors.withOpacity(colors.aviation.secondary, 0.1)
      : colors.withOpacity(colors.semantic.error, 0.1),
    color: answer.isCorrect ? colors.aviation.secondary : colors.semantic.error
  };

  return (
    <div style={containerStyle}>
      <div style={leftSectionStyle}>
        <div style={iconWrapperStyle}>
          {answer.isCorrect ? <CheckIcon /> : <XIcon />}
        </div>
        <div style={textSectionStyle}>
          <p style={titleStyle}>{question.title}</p>
          <p style={subtitleStyle}>
            {question.category.replace('_', ' ')} • {Math.round(answer.timeSpent / 1000)}s
          </p>
        </div>
      </div>
      <div style={badgeStyle}>
        {answer.isCorrect ? 'Correct' : 'Incorrect'}
      </div>
    </div>
  );
};

/**
 * New Dashboard Page Component
 * Built with the Aviation Design System for reliability and consistency
 */
const NewDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { colors, spacing, styles } = useDesignSystem();
  
  // State management with error handling
  const [questions] = useState<Question[]>(sampleQuestions);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe computation of session metrics
  const sessionMetrics = useMemo((): PerformanceMetrics | null => {
    try {
      const answeredQuestions = userAnswers.length;
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
      const averageTimePerQuestion = answeredQuestions > 0 
        ? userAnswers.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / answeredQuestions / 1000 
        : 0;

      // Category performance with error handling
      const categoryPerformance: Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }> = {} as Record<QuestionCategory, { attempted: number; correct: number; accuracy: number }>;
      
      Object.keys(questionCategories).forEach(cat => {
        try {
          const category = cat as QuestionCategory;
          const categoryAnswers = userAnswers.filter(a => {
            const question = questions.find(q => q.id === a.questionId);
            return question?.category === category;
          });
          
          const attempted = categoryAnswers.length;
          const correct = categoryAnswers.filter(a => a.isCorrect).length;
          const categoryAccuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
          
          categoryPerformance[category] = { attempted, correct, accuracy: categoryAccuracy };
        } catch (err) {
          console.warn(`Error processing category ${cat}:`, err);
        }
      });

      return {
        totalQuestions: questions.length,
        answeredQuestions,
        correctAnswers,
        accuracy,
        averageTimePerQuestion,
        categoryPerformance
      };
    } catch (err) {
      console.error('Error computing session metrics:', err);
      setError('Failed to compute progress metrics');
      return null;
    }
  }, [userAnswers, questions]);

  // Load user progress with comprehensive error handling
  useEffect(() => {
    const loadUserProgress = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (user) {
          try {
            // Try database first for authenticated users
            const progress = await databaseService.getUserProgress();
            if (progress && Array.isArray(progress)) {
              setUserAnswers(progress);
            } else {
              // Fallback to localStorage
              const localProgress = storageService.loadUserAnswers();
              setUserAnswers(Array.isArray(localProgress) ? localProgress : []);
            }
          } catch (dbError) {
            console.warn('Database load failed, using localStorage:', dbError);
            const localProgress = storageService.loadUserAnswers();
            setUserAnswers(Array.isArray(localProgress) ? localProgress : []);
          }
        } else {
          // Load from localStorage for unauthenticated users
          const localProgress = storageService.loadUserAnswers();
          setUserAnswers(Array.isArray(localProgress) ? localProgress : []);
        }
      } catch (err) {
        console.error('Failed to load user progress:', err);
        setError('Failed to load your progress data');
        setUserAnswers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProgress();
  }, [user]);

  const hasProgress = userAnswers.length > 0;

  // Action cards configuration
  const actionCards = [
    {
      title: 'Course Notes',
      description: 'Access comprehensive ATPL theory notes and study materials.',
      icon: <DocumentIcon />,
      onClick: () => navigate('/notes')
    },
    {
      title: 'Practice Questions',
      description: 'Test your knowledge with practice questions across all categories.',
      icon: <QuestionIcon />,
      onClick: () => navigate('/questions')
    },
    {
      title: 'Trial Exam',
      description: 'Take a timed trial exam to simulate real exam conditions.',
      icon: <ClockIcon />,
      onClick: () => navigate('/exam'),
      variant: 'featured' as const
    },
    {
      title: 'Flight Planning',
      description: 'Practice flight planning calculations and route optimization.',
      icon: <MapIcon />,
      onClick: () => navigate('/flight-plan')
    },
    {
      title: 'Performance Analytics',
      description: 'Review detailed analytics and track your learning progress.',
      icon: <ChartIcon />,
      onClick: () => navigate('/analytics')
    }
  ];

  if (error) {
    return (
      <div style={{ padding: spacing.scale[6] }}>
        <Card variant="outline" padding="lg">
          <div style={{ textAlign: 'center', color: colors.semantic.error }}>
            <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[2] }}>
              Something went wrong
            </h2>
            <p style={{ marginBottom: spacing.scale[4] }}>{error}</p>
            <SecondaryButton onClick={() => window.location.reload()}>
              Reload Page
            </SecondaryButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[6] }}>
      {/* Welcome Section */}
      <GradientCard padding="lg">
        <div style={{ textAlign: 'center', color: colors.white }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: spacing.radius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.scale[4]} auto`
          }}>
            <AirplaneIcon />
          </div>
          <h1 style={{ 
            ...styles.heading,
            fontSize: '2rem', 
            marginBottom: spacing.scale[2],
            lineHeight: 1.2
          }}>
            Welcome to ATPL Training Platform
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '1.125rem',
            lineHeight: 1.6
          }}>
            {user ? `Welcome back, ${user.email}` : 'Master aviation theory with confidence'}
          </p>
        </div>
      </GradientCard>

      {/* Progress Overview */}
      {hasProgress && sessionMetrics && !isLoading && (
        <Card variant="elevated" padding="lg">
          <CardHeader title="Study Progress" />
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: spacing.scale[6] 
          }}>
            <ProgressMetric
              label="Questions Attempted"
              value={sessionMetrics.answeredQuestions}
              color="primary"
            />
            <ProgressMetric
              label="Correct Answers"
              value={sessionMetrics.correctAnswers}
              color="secondary"
            />
            <ProgressMetric
              label="Accuracy"
              value={`${Math.round(sessionMetrics.accuracy)}%`}
              color="navy"
            />
            <ProgressMetric
              label="Avg. Time"
              value={`${Math.round(sessionMetrics.averageTimePerQuestion)}s`}
              color="muted"
            />
          </div>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: spacing.scale[6] 
      }}>
        {actionCards.map((card, index) => (
          <ActionCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            onClick={card.onClick}
            variant={card.variant}
          />
        ))}
      </div>

      {/* Recent Activity */}
      {hasProgress && !isLoading && (
        <Card variant="default" padding="lg">
          <CardHeader title="Recent Activity" />
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
              {userAnswers
                .slice(-5)
                .reverse()
                .map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  if (!question) return null;
                  
                  return (
                    <ActivityItem
                      key={index}
                      question={question}
                      answer={answer}
                    />
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card variant="default" padding="lg" loading>
          <div style={{ textAlign: 'center', padding: spacing.scale[8] }}>
            <p style={{ color: colors.aviation.muted }}>Loading your dashboard...</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NewDashboardPage;