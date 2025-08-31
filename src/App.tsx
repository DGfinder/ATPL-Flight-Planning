import { AuthProvider } from './contexts/AuthContext';
import EnhancedFlightPlanningApp from './components/EnhancedFlightPlanningApp';

function App() {
  return (
    <AuthProvider>
      <EnhancedFlightPlanningApp />
    </AuthProvider>
  );
}

export default App
