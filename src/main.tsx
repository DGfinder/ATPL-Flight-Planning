import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Import test utilities for development
import { testSupabaseConnection } from './test/supabase-test'

// Make test functions globally available in development
if (import.meta.env.DEV) {
  (window as Window & { testSupabaseConnection?: typeof testSupabaseConnection }).testSupabaseConnection = testSupabaseConnection;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
