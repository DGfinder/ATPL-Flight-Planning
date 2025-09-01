import React, { forwardRef } from 'react';
import { colors, colorTokens } from '../colors';
import { spacing } from '../spacing';

/**
 * Card variant definitions
 */
export type CardVariant = 'default' | 'elevated' | 'interactive' | 'outline' | 'gradient';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card component props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  as?: 'div' | 'article' | 'section';
}

/**
 * Get card styles based on variant and options
 */
function getCardStyles(
  variant: CardVariant,
  padding: CardPadding,
  clickable: boolean,
  loading: boolean
) {
  // Base styles for all cards
  const baseStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: spacing.radius['2xl'],
    transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    opacity: loading ? 0.7 : 1,
    pointerEvents: loading ? 'none' : 'auto'
  };

  // Padding styles
  const paddingStyles = {
    none: {},
    sm: { padding: spacing.component.card.sm },
    md: { padding: spacing.component.card.md },
    lg: { padding: spacing.component.card.lg },
    xl: { padding: spacing.component.card.xl }
  };

  // Variant-specific styles
  const variantStyles = {
    default: {
      background: colorTokens.gradients.card,
      border: `1px solid ${colors.withOpacity(colors.gray[200], 0.8)}`,
      boxShadow: spacing.shadows.md
    },
    elevated: {
      background: colorTokens.gradients.card,
      border: `1px solid ${colors.withOpacity(colors.gray[200], 0.5)}`,
      boxShadow: spacing.shadows.lg
    },
    interactive: {
      background: colorTokens.gradients.card,
      border: `1px solid ${colors.withOpacity(colors.gray[200], 0.8)}`,
      boxShadow: spacing.shadows.md,
      cursor: clickable ? 'pointer' : 'default'
    },
    outline: {
      background: colors.transparent,
      border: `1px solid ${colorTokens.borders.medium}`,
      boxShadow: 'none'
    },
    gradient: {
      background: colorTokens.gradients.primary,
      border: 'none',
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.aviation.primary, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.aviation.primary, 0.1)}`,
      color: colors.white
    }
  };

  // Add highlight effect for elevated cards
  const highlightStyles = variant === 'default' || variant === 'elevated' || variant === 'interactive' ? {
    '::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)'
    }
  } : {};

  return {
    ...baseStyles,
    ...paddingStyles[padding],
    ...variantStyles[variant],
    ...highlightStyles
  };
}

/**
 * Get hover styles for interactive cards
 */
function getHoverStyles(variant: CardVariant, clickable: boolean): React.CSSProperties {
  if (!clickable && variant !== 'interactive') return {};

  const hoverStyles = {
    default: {
      transform: 'translateY(-2px)',
      boxShadow: spacing.shadows.xl,
      borderColor: colors.withOpacity(colors.aviation.primary, 0.2)
    },
    elevated: {
      transform: 'translateY(-4px)',
      boxShadow: spacing.shadows['2xl'],
      borderColor: colors.withOpacity(colors.aviation.primary, 0.2)
    },
    interactive: {
      transform: 'translateY(-2px)',
      boxShadow: spacing.shadows.xl,
      borderColor: colors.withOpacity(colors.aviation.primary, 0.3)
    },
    outline: {
      borderColor: colorTokens.borders.strong,
      background: colors.withOpacity(colors.aviation.primary, 0.02)
    },
    gradient: {
      transform: 'translateY(-2px)',
      boxShadow: `0 20px 25px -5px ${colors.withOpacity(colors.aviation.primary, 0.15)}, 0 8px 10px -6px ${colors.withOpacity(colors.aviation.primary, 0.1)}`
    }
  };

  return hoverStyles[variant];
}

/**
 * Loading skeleton overlay
 */
function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        animation: 'shimmer 2s infinite',
        pointerEvents: 'none'
      }}
    >
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  );
}

/**
 * Aviation Card Component
 * 
 * A flexible card component that follows the aviation design system.
 * Supports multiple variants, interactive states, and loading indicators.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg" hover clickable>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here...</p>
 * </Card>
 * 
 * <Card variant="gradient" padding="md">
 *   <h2>Special Announcement</h2>
 * </Card>
 * 
 * <Card loading padding="md">
 *   <p>Loading content...</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      clickable = false,
      loading = false,
      children,
      className = '',
      style,
      as: Component = 'div',
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const cardStyles = getCardStyles(variant, padding, clickable, loading);
    
    let dynamicStyles: React.CSSProperties = cardStyles;
    if (isHovered && (hover || clickable) && !loading) {
      dynamicStyles = { ...dynamicStyles, ...getHoverStyles(variant, clickable) };
    }

    const combinedStyles: React.CSSProperties = {
      ...dynamicStyles,
      ...style
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover || clickable) {
        setIsHovered(true);
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    return (
      <Component
        ref={ref}
        style={combinedStyles}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        {loading && <LoadingOverlay />}
      </Component>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header Component
 * Provides consistent header styling within cards
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, icon, action, children, style, ...props }, ref) => {
    const headerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.scale[4],
      ...style
    };

    return (
      <div ref={ref} style={headerStyles} {...props}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[3] }}>
          {icon && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: spacing.radius.lg,
                background: colors.withOpacity(colors.aviation.primary, 0.1),
                color: colors.aviation.primary
              }}
            >
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: colorTokens.text.primary,
                  margin: 0,
                  lineHeight: 1.5
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: colorTokens.text.muted,
                  margin: 0,
                  lineHeight: 1.5
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div style={{ flexShrink: 0 }}>
            {action}
          </div>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Content Component
 * Provides consistent content spacing within cards
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, style, ...props }, ref) => {
    const contentStyles: React.CSSProperties = {
      lineHeight: 1.6,
      ...style
    };

    return (
      <div ref={ref} style={contentStyles} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 * Provides consistent footer styling within cards
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, justify = 'end', style, ...props }, ref) => {
    const justifyContent = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between'
    };

    const footerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: justifyContent[justify],
      gap: spacing.scale[3],
      marginTop: spacing.scale[6],
      paddingTop: spacing.scale[4],
      borderTop: `1px solid ${colorTokens.borders.light}`,
      ...style
    };

    return (
      <div ref={ref} style={footerStyles} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * Preset card components for common use cases
 */
export const InteractiveCard = (props: Omit<CardProps, 'variant' | 'hover' | 'clickable'>) => (
  <Card {...props} variant="interactive" hover clickable />
);

export const ElevatedCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="elevated" />
);

export const GradientCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="gradient" />
);

export const OutlineCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="outline" />
);