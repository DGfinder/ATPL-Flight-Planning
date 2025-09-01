import React from 'react';
import { Layout as DesignSystemLayout } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Layout wrapper component that uses the Design System Layout
 * This provides proper aviation styling with inline CSS for production reliability
 */
const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force navigation even if sign out fails
      navigate('/login');
    }
  };

  return (
    <DesignSystemLayout 
      user={user} 
      onSignOut={handleSignOut}
    />
  );
};

export default Layout;