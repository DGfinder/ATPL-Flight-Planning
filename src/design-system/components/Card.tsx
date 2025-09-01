import React, { forwardRef } from 'react';
import { colors, colorTokens } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

/**
 * Card Component Props
 */
export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline' | 'gradient' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Card Variant Types
 */
export type CardVariant = 'default' | 'elevated' | 'outline' | 'gradient' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card Header Props
 */
export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Card Content Props
 */
export interface CardContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Card Footer Props
 */
export interface CardFooterProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Aviation Card Component
 * 
 * Professional card component with consistent aviation styling using inline CSS
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  loading = false,
  onClick,
  className,
  style,
  ...props
}, ref) => {
  // Base card styles
  const baseStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: typography.fontFamilies.primary.join(', '),
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  // Variant styles
  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    default: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: spacing.shadows.md
    },
    elevated: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
      border: `1px solid ${colors.gray[100]}`,
      boxShadow: spacing.shadows.lg
    },
    outline: {
      background: colors.transparent,
      border: `1px solid ${colors.gray[300]}`,
      boxShadow: 'none'
    },
    gradient: {
      background: colorTokens.gradients.primary,
      border: 'none',
      boxShadow: spacing.shadows.lg,
      color: colors.white
    },
    interactive: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: spacing.shadows.md,
      cursor: 'pointer'
    }
  };

  // Padding styles
  const paddingStyles: Record<CardPadding, React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: spacing.scale[3] },
    md: { padding: spacing.scale[4] },
    lg: { padding: spacing.scale[6] },
    xl: { padding: spacing.scale[8] }
  };

  // Hover effects
  const hoverStyle: React.CSSProperties = onClick ? {
    transform: 'translateY(-2px)',
    boxShadow: spacing.shadows.xl
  } : {};

  // Loading overlay
  const loadingOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...paddingStyles[padding],
    ...(onClick ? hoverStyle : {})
  };

  return (
    <div
      ref={ref}
      className={className}
      style={combinedStyles}
      onClick={loading ? undefined : onClick}
      {...props}
    >
      {loading && (
        <div style={loadingOverlayStyle}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid transparent',
            borderTop: `2px solid ${colors.aviation.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Card Header Component
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  title,
  subtitle,
  children,
  style,
  ...props
}, ref) => {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.scale[4],
    ...style
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'inherit',
    margin: 0,
    lineHeight: 1.4
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.gray[500],
    margin: '0.25rem 0 0 0',
    lineHeight: 1.4
  };

  return (
    <div ref={ref} style={headerStyle} {...props}>
      {(title || subtitle) && (
        <div>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

/**
 * Card Content Component
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  children,
  style,
  ...props
}, ref) => {
  const contentStyle: React.CSSProperties = {
    ...style
  };

  return (
    <div ref={ref} style={contentStyle} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  style,
  ...props
}, ref) => {
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.scale[3],
    marginTop: spacing.scale[4],
    paddingTop: spacing.scale[4],
    borderTop: `1px solid ${colors.gray[200]}`,
    ...style
  };

  return (
    <div ref={ref} style={footerStyle} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

/**
 * Interactive Card Component
 */
export const InteractiveCard = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <Card
    ref={ref}
    variant="default"
    {...props}
    style={{
      cursor: 'pointer',
      ...props.style
    }}
  />
));

InteractiveCard.displayName = 'InteractiveCard';

/**
 * Elevated Card Component
 */
export const ElevatedCard = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <Card
    ref={ref}
    variant="elevated"
    {...props}
  />
));

ElevatedCard.displayName = 'ElevatedCard';

/**
 * Gradient Card Component
 */
export const GradientCard = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <Card
    ref={ref}
    variant="gradient"
    {...props}
  />
));

GradientCard.displayName = 'GradientCard';

/**
 * Outline Card Component
 */
export const OutlineCard = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <Card
    ref={ref}
    variant="outline"
    {...props}
  />
));

OutlineCard.displayName = 'OutlineCard';

export default Card;