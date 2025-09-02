import { useState, useCallback } from 'react';
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
  const { colors, spacing } = useDesignSystem();
  return (
    <div style={{ padding: spacing.scale[6] }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.aviation.navy, marginBottom: spacing.scale[2] }}>
        Trial Exam
      </h1>
      <p style={{ color: colors.aviation.muted }}>Coming soon...</p>
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

export default App
