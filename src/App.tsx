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

import type { FlightPlanSegment, TrialExam } from './types';

// Import actual page components
import QuestionsPage from './pages/QuestionsPage';
import NotesPage from './pages/NotesPage';

// Placeholder components using design system
const ExamPage = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [currentExam, setCurrentExam] = useState<TrialExam | null>(null);
  const [examMode, setExamMode] = useState<'generator' | 'taking' | 'results'>('generator');

  const handleExamGenerated = (exam: TrialExam) => {
    setCurrentExam(exam);
  };

  const handleStartExam = (exam: TrialExam) => {
    setCurrentExam(exam);
    setExamMode('taking');
  };

  // const handleExamComplete = () => {
  //   setExamMode('results');
  // };

  const handleBackToGenerator = () => {
    setExamMode('generator');
    setCurrentExam(null);
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
          <div style={{
            padding: spacing.scale[6],
            background: colors.white,
            borderRadius: spacing.radius.lg,
            border: `1px solid ${colors.gray[200]}`,
            textAlign: 'center'
          }}>
            <h2 style={{ 
              ...styles.heading, 
              fontSize: '1.5rem', 
              color: colors.aviation.navy,
              marginBottom: spacing.scale[4]
            }}>
              Exam Interface Coming Soon
            </h2>
            <p style={{ 
              ...styles.body, 
              color: colors.aviation.muted,
              marginBottom: spacing.scale[4]
            }}>
              The exam taking interface with timer, question navigation, and flight planning tools will be available soon.
            </p>
            <div style={{
              padding: spacing.scale[4],
              background: colors.withOpacity(colors.aviation.primary, 0.05),
              borderRadius: spacing.radius.md,
              border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`,
              marginBottom: spacing.scale[4]
            }}>
              <h3 style={{ fontSize: '1rem', color: colors.aviation.navy, marginBottom: spacing.scale[2] }}>
                Generated Exam Details
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: spacing.scale[3],
                fontSize: '0.875rem' 
              }}>
                <div>
                  <strong>Scenario:</strong> {currentExam.scenario}
                </div>
                <div>
                  <strong>Questions:</strong> {currentExam.totalQuestions}
                </div>
                <div>
                  <strong>Total Marks:</strong> {currentExam.totalMarks}
                </div>
                <div>
                  <strong>Time Limit:</strong> {currentExam.timeLimit}min
                </div>
                <div>
                  <strong>Seed:</strong> {currentExam.seed}
                </div>
              </div>
            </div>
            <button
              onClick={handleBackToGenerator}
              style={{
                padding: `${spacing.scale[3]} ${spacing.scale[4]}`,
                background: colors.aviation.primary,
                color: colors.white,
                border: 'none',
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Generator
            </button>
          </div>
        )}

        {examMode === 'results' && currentExam && (
          <div style={{
            padding: spacing.scale[6],
            background: colors.white,
            borderRadius: spacing.radius.lg,
            border: `1px solid ${colors.gray[200]}`,
            textAlign: 'center'
          }}>
            <h2 style={{ 
              ...styles.heading, 
              fontSize: '1.5rem', 
              color: colors.aviation.navy,
              marginBottom: spacing.scale[4]
            }}>
              Exam Results
            </h2>
            <p style={{ 
              ...styles.body, 
              color: colors.aviation.muted,
              marginBottom: spacing.scale[4]
            }}>
              Results display with detailed scoring and performance analytics will be available soon.
            </p>
            <button
              onClick={handleBackToGenerator}
              style={{
                padding: `${spacing.scale[3]} ${spacing.scale[4]}`,
                background: colors.aviation.primary,
                color: colors.white,
                border: 'none',
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Generate New Exam
            </button>
          </div>
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
