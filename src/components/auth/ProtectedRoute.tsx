import React from 'react';
import { Card, useDesignSystem } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false,
  isAuthenticated: providedAuth, 
  isLoading: providedLoading 
}) => {
  const { user, loading } = useAuth();
  
  // Use provided props or derive from auth context
  const isAuthenticated = providedAuth ?? !!user;
  const isLoading = providedLoading ?? loading;
  const { colors, spacing, styles } = useDesignSystem();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.aviation.light} 0%, ${colors.white} 50%, ${colors.aviation.accent} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card style={{
          padding: spacing.scale[8],
          textAlign: 'center'
        }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '3rem',
            width: '3rem',
            border: `2px solid ${colors.aviation.primary}`,
            borderTop: '2px solid transparent',
            margin: '0 auto',
            marginBottom: spacing.scale[4]
          }} />
          <p style={{ ...styles.body, color: colors.aviation.muted }}>
            Loading...
          </p>
        </Card>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.aviation.light} 0%, ${colors.white} 50%, ${colors.aviation.accent} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card style={{
          padding: spacing.scale[8],
          textAlign: 'center'
        }}>
          <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[4] }}>
            Authentication Required
          </h2>
          <p style={{ ...styles.body, color: colors.aviation.muted }}>
            Please log in to access this page.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;