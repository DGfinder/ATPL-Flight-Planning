import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import EnhancedFlightPlanningApp from './components/EnhancedFlightPlanningApp';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EnhancedFlightPlanningApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
