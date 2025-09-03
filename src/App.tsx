import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NewDashboardPage from './pages/NewDashboardPage';
import { useDesignSystem } from './design-system';
import FlightPlanTable from './components/flight-plan/FlightPlanTable';

import type { FlightPlanSegment } from './types';

// Import actual page components
import QuestionsPage from './pages/QuestionsPage';
import NotesPage from './pages/NotesPage';

// Placeholder components using design system
const ExamPage = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [showFlightPlan, setShowFlightPlan] = useState(false);
  const [showFuelPolicy, setShowFuelPolicy] = useState(false);
  const [flightPlanData, setFlightPlanData] = useState<Record<string, any>>({});
  const [currentFlightPlanData, setCurrentFlightPlanData] = useState<any>(null);

  // Load saved flight plan data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('examFlightPlanData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFlightPlanData(parsedData);
      }
    } catch (error) {
      console.warn('Failed to load exam flight plan data from localStorage:', error);
    }
  }, []);

  const handleOpenFlightPlan = () => {
    const questionId = `exam-question-1`;
    const existingData = flightPlanData[questionId] || null;
    setCurrentFlightPlanData(existingData);
    setShowFlightPlan(true);
  };

  const handleFlightPlanDataChange = (newData: any) => {
    const questionId = `exam-question-1`;
    const updatedData = {
      ...flightPlanData,
      [questionId]: newData
    };
    setFlightPlanData(updatedData);
    setCurrentFlightPlanData(newData);
    
    // Save to localStorage
    try {
      localStorage.setItem('examFlightPlanData', JSON.stringify(updatedData));
    } catch (error) {
      console.warn('Failed to save exam flight plan data to localStorage:', error);
    }
  };

  const handleOpenFuelPolicy = () => {
    setShowFuelPolicy(true);
  };

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Exam Header */}
        <div style={{
          padding: spacing.scale[4],
          background: colors.withOpacity(colors.aviation.primary, 0.05),
          borderRadius: spacing.radius.lg,
          border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`,
          marginBottom: spacing.scale[6]
        }}>
          <h1 style={{ 
            ...styles.heading, 
            fontSize: '1.5rem', 
            color: colors.aviation.navy,
            marginBottom: spacing.scale[2]
          }}>
            Trial Exam
          </h1>
          <p style={{ 
            ...styles.body, 
            color: colors.aviation.muted,
            marginBottom: spacing.scale[4]
          }}>
            Practice exam mode with interactive tools
          </p>
          
          {/* Interactive Tools */}
          <div style={{ 
            display: 'flex', 
            gap: spacing.scale[2],
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleOpenFlightPlan}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2],
                padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                background: colors.aviation.primary,
                color: colors.white,
                border: 'none',
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ✈️ Flight Plan
            </button>
            <button
              onClick={handleOpenFuelPolicy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2],
                padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                background: colors.aviation.secondary,
                color: colors.white,
                border: 'none',
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ⛽ Fuel Policy
            </button>
          </div>
        </div>

        {/* Exam Content Placeholder */}
        <div style={{
          padding: spacing.scale[6],
          background: colors.white,
          borderRadius: spacing.radius.lg,
          border: `1px solid ${colors.gray[200]}`,
          textAlign: 'center'
        }}>
          <h2 style={{ 
            ...styles.heading, 
            fontSize: '1.25rem', 
            color: colors.aviation.navy,
            marginBottom: spacing.scale[3]
          }}>
            Exam Questions Coming Soon
          </h2>
          <p style={{ 
            ...styles.body, 
            color: colors.aviation.muted,
            marginBottom: spacing.scale[4]
          }}>
            The trial exam will include interactive flight planning and fuel policy tools.
          </p>
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
                alignItems: 'center'
              }}>
                <div>
                  <h2 style={{ ...styles.heading, margin: 0 }}>Interactive Flight Plan</h2>
                  <p style={{ 
                    ...styles.caption, 
                    marginTop: spacing.scale[1],
                    color: colors.aviation.muted 
                  }}>
                    Trial Exam - Question 1
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
                  initialData={currentFlightPlanData}
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
              maxWidth: '800px',
              background: colors.white,
              borderRadius: spacing.radius.lg,
              padding: spacing.scale[4]
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.scale[4]
              }}>
                <h2 style={{ ...styles.heading, margin: 0 }}>Fuel Policy Calculator</h2>
                <button
                  onClick={() => setShowFuelPolicy(false)}
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
              <p style={{ 
                ...styles.body, 
                color: colors.aviation.muted,
                textAlign: 'center',
                padding: spacing.scale[6]
              }}>
                Fuel Policy Calculator will be available when exam questions are implemented.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FlightPlanPage = () => {
  const { spacing } = useDesignSystem();
  const [flightPlanSegments, setFlightPlanSegments] = useState<FlightPlanSegment[]>([]);

  const handleFlightPlanUpdate = useCallback((segments: FlightPlanSegment[]) => {
    setFlightPlanSegments(segments);
  }, []);

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Interactive Flight Plan Table - Now the primary focus */}
        <FlightPlanTable 
          onFlightPlanUpdate={handleFlightPlanUpdate}
          initialSegments={flightPlanSegments}
        />
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
