import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Placeholder components for other routes
const NotesPage = () => <div className="p-8"><h1 className="text-2xl font-bold text-aviation-navy">Course Notes</h1><p className="text-aviation-muted mt-2">Coming soon...</p></div>;
const QuestionsPage = () => <div className="p-8"><h1 className="text-2xl font-bold text-aviation-navy">Practice Questions</h1><p className="text-aviation-muted mt-2">Coming soon...</p></div>;
const ExamPage = () => <div className="p-8"><h1 className="text-2xl font-bold text-aviation-navy">Trial Exam</h1><p className="text-aviation-muted mt-2">Coming soon...</p></div>;
const FlightPlanPage = () => <div className="p-8"><h1 className="text-2xl font-bold text-aviation-navy">Flight Planning</h1><p className="text-aviation-muted mt-2">Coming soon...</p></div>;
const AnalyticsPage = () => <div className="p-8"><h1 className="text-2xl font-bold text-aviation-navy">Performance Analytics</h1><p className="text-aviation-muted mt-2">Coming soon...</p></div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes with layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="exam" element={<ExamPage />} />
              <Route path="flight-plan" element={<FlightPlanPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
