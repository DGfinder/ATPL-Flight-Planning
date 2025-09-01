import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { colorTokens } from '../colors';
import { spacing } from '../spacing';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * Layout Component Props
 */
export interface LayoutProps {
  user?: { email?: string } | null;
  onSignOut?: () => void;
}

/**
 * Mobile Sidebar Overlay Component
 */
interface MobileSidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileSidebarOverlay: React.FC<MobileSidebarOverlayProps> = ({ 
  isOpen, 
  onClose, 
  children 
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(4px)',
    display: isOpen ? 'block' : 'none'
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '16rem',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 50
  };

  return (
    <>
      {/* Overlay */}
      <div style={overlayStyle} onClick={onClose} />
      
      {/* Mobile Sidebar */}
      <div style={sidebarStyle}>
        {children}
      </div>
    </>
  );
};

/**
 * Main Content Area Component
 */
interface MainContentProps {
  sidebarCollapsed: boolean;
  isMobile: boolean;
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ 
  sidebarCollapsed, 
  isMobile, 
  children 
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem',
    transition: 'margin-left 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    minHeight: '100vh'
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: spacing.scale[6]
  };

  return (
    <div style={containerStyle}>
      {children}
      <main style={mainStyle}>
        <div style={contentStyle}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

/**
 * Aviation Layout Component
 * 
 * Complete layout with sidebar, header, and main content area
 * Uses inline styling for production reliability
 */
export const Layout: React.FC<LayoutProps> = ({ user, onSignOut }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile detection with proper cleanup
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      // Auto-close mobile menu if switching to desktop
      if (!newIsMobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [window.location.pathname]);

  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: colorTokens.gradients.background,
    display: 'flex',
    position: 'relative'
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div style={layoutStyle}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          user={user}
          onSignOut={onSignOut}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebarOverlay 
          isOpen={mobileMenuOpen} 
          onClose={handleCloseMobileMenu}
        >
          <Sidebar
            collapsed={false}
            user={user}
            onSignOut={onSignOut}
          />
        </MobileSidebarOverlay>
      )}

      {/* Main Content Area */}
      <MainContent 
        sidebarCollapsed={sidebarCollapsed} 
        isMobile={isMobile}
      >
        {/* Header */}
        <Header
          isMobile={isMobile}
          showMobileMenu={mobileMenuOpen}
          onToggleMobileMenu={handleToggleMobileMenu}
        />
      </MainContent>
    </div>
  );
};

export default Layout;