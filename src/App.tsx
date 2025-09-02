import { useState, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NewDashboardPage from './pages/NewDashboardPage';
import { useDesignSystem } from './design-system';
import FlightPlanTable from './components/flight-plan/FlightPlanTable';
import FlightPlanVisualization from './components/flight-plan/FlightPlanVisualization';
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
  const { spacing, colors } = useDesignSystem();
  const [flightPlanSegments, setFlightPlanSegments] = useState<FlightPlanSegment[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleFlightPlanUpdate = useCallback((segments: FlightPlanSegment[]) => {
    setFlightPlanSegments(segments);
  }, []);

  // Convert segments to flight plan data format for visualization
  const visualizationData = useMemo(() => {
    // Only create visualization data if there are segments with actual data
    const hasValidSegments = flightPlanSegments.some(seg => 
      seg.segment && seg.flightLevel > 0 && seg.distance > 0
    );
    
    if (!hasValidSegments) return undefined;

    const totals = {
      distance: flightPlanSegments.reduce((sum, seg) => sum + seg.distance, 0),
      time: flightPlanSegments.reduce((sum, seg) => sum + seg.estimatedTimeInterval, 0),
      fuel: flightPlanSegments.reduce((sum, seg) => sum + seg.zoneFuel, 0)
    };

    return {
      departure: { code: 'YSSY', name: 'Sydney', lat: -33.9461, lon: 151.1772, elevation: 21 },
      arrival: { code: 'YPPH', name: 'Perth', lat: -31.9403, lon: 115.9672, elevation: 67 },
      waypoints: flightPlanSegments
        .filter(segment => segment.segment && segment.flightLevel > 0) // Only include valid waypoints
        .map((segment, index) => ({
          id: index + 1,
          code: segment.segment,
          lat: -33 + (index * 0.5),
          lon: 151 - (index * 2),
          altitude: segment.flightLevel * 100,
          time: `${Math.floor(segment.estimatedTimeInterval / 60)}:${(segment.estimatedTimeInterval % 60).toString().padStart(2, '0')}`,
          fuel: segment.zoneFuel
        })),
      alternates: [],
      plannedAltitude: flightPlanSegments[0]?.flightLevel * 100 || 37000,
      distance: totals.distance,
      estimatedTime: `${Math.floor(totals.time / 60)}:${(totals.time % 60).toString().padStart(2, '0')}`,
      fuelRequired: totals.fuel,
      winds: { direction: 270, speed: 45 }
    };
  }, [flightPlanSegments]);

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Visualization Toggle Button */}
        {visualizationData && (
          <div style={{ 
            marginBottom: spacing.scale[4],
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              style={{
                padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
                background: showVisualization ? colors.aviation.primary : colors.white,
                color: showVisualization ? colors.white : colors.aviation.primary,
                border: `2px solid ${colors.aviation.primary}`,
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2]
              }}
            >
              {showVisualization ? 'Hide Route Visualization' : 'Show Route Visualization'}
            </button>
          </div>
        )}

        {/* Flight Visualization (conditionally shown) */}
        {showVisualization && visualizationData && (
          <div style={{ 
            marginBottom: spacing.scale[6],
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: spacing.radius.lg,
            overflow: 'hidden'
          }}>
            <FlightPlanVisualization flightPlan={visualizationData} />
          </div>
        )}
        
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
                <ProtectedRoute>
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
