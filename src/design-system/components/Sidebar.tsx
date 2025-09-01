import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, colorTokens } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

// Icon components for proper typing and reliability
interface IconProps {
  className?: string;
  size?: number;
}

const LayoutDashboardIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"/>
    <rect x="14" y="3" width="7" height="5"/>
    <rect x="14" y="12" width="7" height="9"/>
    <rect x="3" y="16" width="7" height="5"/>
  </svg>
);

const BookOpenIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const HelpCircleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <circle cx="12" cy="17" r="1"/>
  </svg>
);

const ClockIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const MapIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

const BarChart3Icon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
  </svg>
);

const PlaneIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 2-3.5 3.5L11 16l-8.2 1.8c-.5.1-.8.6-.8 1.1s.3 1 .8 1.1L11 21l5.5-1.5c.4-.1.8-.6.8-1.1s-.4-1-.5-1.2z"/>
</svg>
);

const UserIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LogOutIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const ChevronLeftIcon: React.FC<IconProps & { rotate?: string }> = ({ size = 16, rotate }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ transform: rotate }}
  >
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);

// Navigation configuration
const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Course Notes',
    path: '/notes',
    icon: BookOpenIcon,
  },
  {
    name: 'Practice Questions',
    path: '/questions',
    icon: HelpCircleIcon,
  },
  {
    name: 'Trial Exam',
    path: '/exam',
    icon: ClockIcon,
  },
  {
    name: 'Flight Planning',
    path: '/flight-plan',
    icon: MapIcon,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3Icon,
  },
];

/**
 * Sidebar Props
 */
export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  user?: { email?: string } | null;
  onSignOut?: () => void;
}

/**
 * Navigation Item Component
 */
interface NavigationItemProps {
  name: string;
  path: string;
  icon: React.FC<IconProps>;
  isActive: boolean;
  collapsed: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  name, 
  path, 
  icon: Icon, 
  isActive, 
  collapsed 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    borderRadius: spacing.radius.lg,
    padding: `${spacing.scale[2.5]} ${spacing.scale[3]}`,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const activeStyle: React.CSSProperties = isActive ? {
    background: colorTokens.gradients.primary,
    color: colors.white,
    boxShadow: `0 4px 12px ${colors.withOpacity(colors.aviation.primary, 0.3)}`
  } : {};

  const hoverStyle: React.CSSProperties = !isActive && isHovered ? {
    backgroundColor: colors.withOpacity(colors.aviation.primary, 0.05),
    color: colors.aviation.primary
  } : {};

  const defaultStyle: React.CSSProperties = !isActive ? {
    color: colors.gray[600],
    backgroundColor: colors.transparent
  } : {};

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...defaultStyle,
    ...activeStyle,
    ...hoverStyle
  };

  const iconColor = isActive ? colors.white : isHovered ? colors.aviation.primary : colors.gray[400];

  return (
    <Link
      to={path}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ color: iconColor, transition: 'color 200ms ease' }}>
        <Icon size={16} />
      </div>
      {!collapsed && (
        <>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </span>
          {isActive && (
            <div
              style={{
                width: spacing.scale[1.5],
                height: spacing.scale[1.5],
                backgroundColor: colors.white,
                borderRadius: spacing.radius.full,
                marginLeft: 'auto'
              }}
            />
          )}
        </>
      )}
    </Link>
  );
};

/**
 * User Profile Component
 */
interface UserProfileProps {
  user?: { email?: string } | null;
  collapsed: boolean;
  onSignOut?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, collapsed, onSignOut }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  if (!user) {
    const [isHovered, setIsHovered] = React.useState(false);
    
    const signInButtonStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: collapsed ? 0 : spacing.scale[2],
      borderRadius: spacing.radius.lg,
      background: colorTokens.gradients.primary,
      padding: collapsed 
        ? `${spacing.scale[2]} ${spacing.scale[2]}` // Square padding for collapsed
        : `${spacing.scale[2.5]} ${spacing.scale[3]}`, // Normal padding for expanded
      fontSize: collapsed ? '0' : '0.875rem', // Hide text in collapsed mode
      fontWeight: 500,
      color: colors.white,
      textDecoration: 'none',
      transition: 'all 200ms ease',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      boxShadow: isHovered 
        ? `0 8px 16px ${colors.withOpacity(colors.aviation.primary, 0.3)}` 
        : `0 4px 8px ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
      transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
      fontFamily: typography.fontFamilies.primary.join(', ')
    };

    return (
      <Link
        to="/login"
        style={signInButtonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {collapsed ? (
          <UserIcon size={16} />
        ) : (
          'Sign In'
        )}
      </Link>
    );
  }

  const profileStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    width: '100%',
    padding: `${spacing.scale[2.5]} ${spacing.scale[3]}`,
    borderRadius: spacing.radius.lg,
    backgroundColor: isHovered ? colors.gray[50] : colors.transparent,
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.gray[700],
    cursor: 'pointer',
    transition: 'all 200ms ease'
  };

  const avatarStyle: React.CSSProperties = {
    width: spacing.scale[6],
    height: spacing.scale[6],
    borderRadius: spacing.radius.full,
    background: colorTokens.gradients.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.white,
    flexShrink: 0
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: spacing.scale[2],
    backgroundColor: colors.white,
    borderRadius: spacing.radius.lg,
    boxShadow: spacing.shadows.lg,
    border: `1px solid ${colors.gray[200]}`,
    overflow: 'hidden'
  };

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    width: '100%',
    padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
    border: 'none',
    backgroundColor: colors.transparent,
    fontSize: '0.875rem',
    color: colors.gray[700],
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 200ms ease'
  };

  const menuItemHoverStyle: React.CSSProperties = {
    backgroundColor: colors.gray[50]
  };

  return (
    <div style={profileStyle}>
      <button
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowMenu(!showMenu)}
      >
        <div style={avatarStyle}>
          {user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: colors.gray[900], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '0.625rem', color: colors.gray[500] }}>
                Authenticated
              </div>
            </div>
            <ChevronLeftIcon 
              size={16} 
              rotate={showMenu ? 'rotate(90deg)' : 'rotate(-90deg)'} 
            />
          </>
        )}
      </button>

      {/* User Menu */}
      {showMenu && !collapsed && (
        <div style={menuStyle}>
          <button
            style={menuItemStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: colors.transparent })}
            onClick={() => {
              onSignOut?.();
              setShowMenu(false);
            }}
          >
            <LogOutIcon size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Aviation Sidebar Component
 * 
 * A professional sidebar with aviation styling and inline CSS for production reliability
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed = false, 
  onToggleCollapse,
  user,
  onSignOut 
}) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const sidebarStyle: React.CSSProperties = {
    width: collapsed ? '4rem' : '16rem',
    minWidth: collapsed ? '4rem' : '16rem',
    maxWidth: collapsed ? '4rem' : '16rem',
    height: '100vh',
    backgroundColor: colors.white,
    borderRight: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 40,
    transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    boxSizing: 'border-box'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    padding: `${spacing.scale[6]} ${spacing.scale[4]}`,
    borderBottom: `1px solid ${colors.gray[200]}`,
    position: 'relative'
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing.scale[8],
    height: spacing.scale[8],
    background: colorTokens.gradients.primary,
    borderRadius: spacing.radius.lg,
    color: colors.white
  };

  const brandStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  };

  const brandTitleStyle: React.CSSProperties = {
    fontWeight: 700,
    color: colors.aviation.navy,
    fontSize: '0.875rem',
    lineHeight: 1.2
  };

  const brandSubtitleStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.aviation.muted,
    lineHeight: 1.2
  };

  const collapseButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '-0.75rem',
    top: '2.25rem',
    width: spacing.scale[6],
    height: spacing.scale[6],
    borderRadius: spacing.radius.full,
    border: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.white,
    color: colors.gray[600],
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 200ms ease',
    zIndex: 50
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: `${spacing.scale[4]} ${spacing.scale[3]}`
  };

  const navListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.scale[1]
  };

  const footerStyle: React.CSSProperties = {
    borderTop: `1px solid ${colors.gray[200]}`,
    padding: spacing.scale[3]
  };

  return (
    <aside style={sidebarStyle}>
      {/* Header with Logo and Brand */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          <PlaneIcon size={16} />
        </div>
        {!collapsed && (
          <div style={brandStyle}>
            <span style={brandTitleStyle}>Aviation Theory Services</span>
            <span style={brandSubtitleStyle}>ATPL Training Platform</span>
          </div>
        )}
        
        {/* Collapse Button */}
        {onToggleCollapse && (
          <button
            style={collapseButtonStyle}
            onClick={onToggleCollapse}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.aviation.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.gray[600];
            }}
          >
            <ChevronLeftIcon 
              size={16} 
              rotate={collapsed ? 'rotate(180deg)' : ''} 
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        <div style={navListStyle}>
          {navigation.map((item) => (
            <NavigationItem
              key={item.path}
              name={item.name}
              path={item.path}
              icon={item.icon}
              isActive={isActivePath(item.path)}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div style={footerStyle}>
        <UserProfile 
          user={user} 
          collapsed={collapsed} 
          onSignOut={onSignOut}
        />
      </div>
    </aside>
  );
};

export default Sidebar;