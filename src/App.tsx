import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NewDashboardPage from './pages/NewDashboardPage';
import { useDesignSystem } from './design-system';
import { Navigation } from 'lucide-react';
import FlightPlanTable from './components/flight-plan/FlightPlanTable';
import TrialExamGenerator from './components/exam/TrialExamGenerator';
import ExamInterface from './components/exam/ExamInterface';
import ExamResults from './components/exam/ExamResults';
import QuestionReview from './components/exam/QuestionReview';

import type { FlightPlanSegment, TrialExam, ExamSession, ExamResult } from './types';
import { ExamSessionManager } from './services/examService';

// Import actual page components
import QuestionsPage from './pages/QuestionsPage';
import NotesPage from './pages/NotesPage';

// Placeholder components using design system
const ExamPage = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [currentExam, setCurrentExam] = useState<TrialExam | null>(null);
  const [examMode, setExamMode] = useState<'generator' | 'taking' | 'results' | 'review'>('generator');
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const handleExamGenerated = (exam: TrialExam) => {
    setCurrentExam(exam);
  };

  const handleStartExam = (exam: TrialExam) => {
    setCurrentExam(exam);
    setExamMode('taking');
  };

  const handleExamComplete = (session: ExamSession) => {
    if (currentExam) {
      const result = ExamSessionManager.calculateResults(currentExam, session);
      setExamResult(result);
      setExamMode('results');
      // Clear the session from localStorage
      ExamSessionManager.clearSession();
    }
  };

  const handleBackToGenerator = () => {
    setExamMode('generator');
    setCurrentExam(null);
    setExamResult(null);
  };

  const handleReviewQuestions = () => {
    setExamMode('review');
  };

  const handleBackToResults = () => {
    setExamMode('results');
  };

  const handleExitExam = () => {
    // Confirm before exiting
    if (window.confirm('Are you sure you want to exit the exam? Your progress will be saved.')) {
      setExamMode('generator');
    }
  };

  return (
    <div style={{ 
      padding: spacing.scale[4],
      minHeight: '100vh',
      background: colors.gray[50]
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          padding: spacing.scale[6],
          background: colors.white,
          borderRadius: spacing.radius.lg,
          border: `1px solid ${colors.gray[200]}`,
          marginBottom: spacing.scale[6],
          textAlign: 'center'
        }}>
          <h1 style={{ 
            ...styles.heading, 
            fontSize: '2rem', 
            color: colors.aviation.navy,
            marginBottom: spacing.scale[2]
          }}>
            CASA ATPL Flight Planning
          </h1>
          <h2 style={{ 
            ...styles.heading, 
            fontSize: '1.25rem', 
            color: colors.aviation.primary,
            marginBottom: spacing.scale[3]
          }}>
            Trial Exam Generator
          </h2>
          <p style={{ 
            ...styles.body, 
            color: colors.aviation.muted,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Generate seeded trial exams following CASA's authentic 17-question matrix with 3×5 marks, 2-3×4 marks, and distributed 1-3 mark questions.
          </p>
        </div>

        {/* Content based on mode */}
        {examMode === 'generator' && (
          <TrialExamGenerator
            onExamGenerated={handleExamGenerated}
            onStartExam={handleStartExam}
          />
        )}

        {examMode === 'taking' && currentExam && (
          <ExamInterface
            exam={currentExam}
            onExamComplete={handleExamComplete}
            onExitExam={handleExitExam}
          />
        )}

        {examMode === 'results' && examResult && (
          <ExamResults
            result={examResult}
            onNewExam={handleBackToGenerator}
            onReviewQuestions={handleReviewQuestions}
          />
        )}

        {examMode === 'review' && examResult && (
          <QuestionReview
            result={examResult}
            onBackToResults={handleBackToResults}
          />
        )}
      </div>
    </div>
  );
};

const FlightPlanPage = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [flightPlanSegments, setFlightPlanSegments] = useState<FlightPlanSegment[]>([]);
  const [showFlightPlan, setShowFlightPlan] = useState(true); // Always show as popup

  const handleFlightPlanUpdate = useCallback((segments: FlightPlanSegment[]) => {
    setFlightPlanSegments(segments);
  }, []);

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Button to open flight plan popup */}
        <div style={{ textAlign: 'center', marginBottom: spacing.scale[6] }}>
          <button
            onClick={() => setShowFlightPlan(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2],
              padding: `${spacing.scale[3]} ${spacing.scale[4]}`,
              background: colors.aviation.primary,
              color: colors.white,
              border: 'none',
              borderRadius: spacing.radius.md,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              margin: '0 auto'
            }}
          >
            <Navigation style={{ width: '1.25rem', height: '1.25rem' }} />
            Open Flight Planning Sheet
          </button>
        </div>

        {/* Flight Plan Popup */}
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
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: colors.aviation.primary,
                    margin: 0
                  }}>
                    Interactive Flight Planning Sheet
                  </h2>
                  <p style={{
                    ...styles.caption,
                    marginTop: spacing.scale[1],
                    color: colors.aviation.muted,
                    margin: 0
                  }}>
                    Full-screen flight planning interface
                  </p>
                </div>
                <button
                  onClick={() => setShowFlightPlan(false)}
                  style={{
                    padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                    background: colors.gray[200],
                    color: colors.aviation.navy,
                    border: 'none',
                    borderRadius: spacing.radius.md,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <FlightPlanTable 
                  onFlightPlanUpdate={handleFlightPlanUpdate}
                  initialSegments={flightPlanSegments}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const { colors, spacing } = useDesignSystem();
  return (
    <div style={{ padding: spacing.scale[6] }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.aviation.navy, marginBottom: spacing.scale[2] }}>
        Performance Analytics
      </h1>
      <p style={{ color: colors.aviation.muted }}>Coming soon...</p>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public login route */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected main app routes with authentication required */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<NewDashboardPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="notes/:subjectId" element={<NotesPage />} />
              <Route path="notes/:subjectId/:contentType" element={<NotesPage />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="exam" element={<ExamPage />} />
              <Route path="flight-plan" element={<FlightPlanPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
            
            {/* Fallback route - redirect to login for unauthenticated users */}
            <Route 
              path="*" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
