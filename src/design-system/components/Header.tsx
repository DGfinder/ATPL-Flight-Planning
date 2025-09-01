import React from 'react';
import { colors, colorTokens } from '../colors';
import { spacing } from '../spacing';

/**
 * Breadcrumb Component with inline styling
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const ChevronRightIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items = [], 
  separator = <ChevronRightIcon size={14} /> 
}) => {
  // Default breadcrumb based on current path if no items provided
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Aviation Theory Services', active: false },
    { label: 'Dashboard', active: true }
  ];

  const breadcrumbItems = items.length > 0 ? items : defaultItems;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[2],
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)'
  };

  const itemStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    transition: 'color 200ms ease'
  };

  const activeItemStyle: React.CSSProperties = {
    color: colors.white,
    fontWeight: 500
  };

  const separatorStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.4)'
  };

  return (
    <nav style={containerStyle}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span style={separatorStyle}>
              {separator}
            </span>
          )}
          <span style={item.active ? { ...itemStyle, ...activeItemStyle } : itemStyle}>
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Mobile Menu Button Component
 */
interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const XIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    top: spacing.scale[4],
    left: spacing.scale[4],
    zIndex: 50,
    width: spacing.scale[10],
    height: spacing.scale[10],
    backgroundColor: colors.white,
    borderRadius: spacing.radius.lg,
    border: `1px solid ${colors.gray[200]}`,
    boxShadow: spacing.shadows.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    color: isHovered ? colors.aviation.primary : colors.gray[600]
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isOpen ? <XIcon /> : <MenuIcon />}
    </button>
  );
};

/**
 * Header Component Props
 */
export interface HeaderProps {
  breadcrumbItems?: BreadcrumbItem[];
  isMobile?: boolean;
  showMobileMenu?: boolean;
  onToggleMobileMenu?: () => void;
  actions?: React.ReactNode;
}

/**
 * Aviation Header Component
 * 
 * Professional header with aviation gradient and inline styling for reliability
 */
export const Header: React.FC<HeaderProps> = ({
  breadcrumbItems,
  isMobile = false,
  showMobileMenu = false,
  onToggleMobileMenu,
  actions
}) => {
  const headerStyle: React.CSSProperties = {
    background: colorTokens.gradients.header,
    color: colors.white,
    boxShadow: spacing.shadows.lg,
    position: 'relative',
    zIndex: 30
  };

  const contentStyle: React.CSSProperties = {
    padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
    marginLeft: isMobile ? spacing.scale[16] : '0'
  };

  const innerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const breadcrumbContainerStyle: React.CSSProperties = {
    flex: 1
  };

  const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[4]
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && onToggleMobileMenu && (
        <MobileMenuButton 
          isOpen={showMobileMenu} 
          onClick={onToggleMobileMenu} 
        />
      )}
      
      {/* Header */}
      <header style={headerStyle}>
        <div style={contentStyle}>
          <div style={innerContentStyle}>
            <div style={breadcrumbContainerStyle}>
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {actions && (
              <div style={actionsContainerStyle}>
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;