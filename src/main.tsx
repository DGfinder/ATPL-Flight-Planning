import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Import consolidated global styles with design system
import './styles/globals.css'

// Initialize design system tokens
import { injectDesignTokens } from './design-system'

// Import test utilities for development
import { testSupabaseConnection } from './test/supabase-test'

// Initialize design tokens immediately
injectDesignTokens();

// Make test functions globally available in development
if (import.meta.env.DEV) {
  (window as Window & { testSupabaseConnection?: typeof testSupabaseConnection }).testSupabaseConnection = testSupabaseConnection;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
