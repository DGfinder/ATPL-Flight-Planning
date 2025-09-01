import React, { forwardRef } from 'react';
import { colors, colorTokens } from '../colors';
import { spacing, spacingUtils } from '../spacing';
import { textStyles } from '../typography';

/**
 * Button variant definitions
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

/**
 * Get button styles based on variant and size
 */
function getButtonStyles(variant: ButtonVariant, size: ButtonSize, loading: boolean, fullWidth: boolean) {
  // Base styles for all buttons
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: textStyles.label.md.fontFamily,
    fontWeight: textStyles.label.md.fontWeight,
    letterSpacing: textStyles.label.md.letterSpacing,
    lineHeight: textStyles.label.md.lineHeight,
    textDecoration: 'none',
    border: 'none',
    borderRadius: spacing.radius.xl,
    cursor: loading ? 'wait' : 'pointer',
    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.7 : 1,
    pointerEvents: loading ? 'none' : 'auto'
  };

  // Size-specific styles
  const sizeStyles = {
    xs: {
      fontSize: '0.75rem',
      ...spacingUtils.padding(2, 1),
      gap: spacing.scale[1.5]
    },
    sm: {
      fontSize: '0.875rem',
      ...spacingUtils.padding(3, 1.5),
      gap: spacing.scale[2]
    },
    md: {
      fontSize: '0.875rem',
      ...spacingUtils.padding(4, 2),
      gap: spacing.scale[2]
    },
    lg: {
      fontSize: '1rem',
      ...spacingUtils.padding(6, 3),
      gap: spacing.scale[2.5]
    },
    xl: {
      fontSize: '1.125rem',
      ...spacingUtils.padding(8, 4),
      gap: spacing.scale[3]
    }
  };

  // Variant-specific styles
  const variantStyles = {
    primary: {
      background: colorTokens.gradients.primary,
      color: colors.white,
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.aviation.primary, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.aviation.primary, 0.1)}`
    },
    secondary: {
      background: colorTokens.gradients.subtle,
      color: colorTokens.text.primary,
      border: `1px solid ${colorTokens.borders.light}`,
      boxShadow: spacing.shadows.sm
    },
    ghost: {
      background: 'transparent',
      color: colorTokens.text.accent,
      border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.3)}`
    },
    danger: {
      background: `linear-gradient(135deg, ${colors.semantic.error} 0%, #dc2626 100%)`,
      color: colors.white,
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.semantic.error, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.semantic.error, 0.1)}`
    },
    success: {
      background: `linear-gradient(135deg, ${colors.semantic.success} 0%, #16a34a 100%)`,
      color: colors.white,
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.semantic.success, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.semantic.success, 0.1)}`
    }
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };
}

/**
 * Get hover styles for button variants
 */
function getHoverStyles(variant: ButtonVariant): React.CSSProperties {
  const hoverStyles = {
    primary: {
      transform: 'translateY(-2px)',
      boxShadow: `0 20px 25px -5px ${colors.withOpacity(colors.aviation.primary, 0.15)}, 0 8px 10px -6px ${colors.withOpacity(colors.aviation.primary, 0.1)}`
    },
    secondary: {
      transform: 'translateY(-1px)',
      background: colorTokens.gradients.card,
      borderColor: colors.withOpacity(colors.aviation.primary, 0.3),
      boxShadow: spacing.shadows.md
    },
    ghost: {
      background: colors.withOpacity(colors.aviation.primary, 0.05),
      borderColor: colors.withOpacity(colors.aviation.primary, 0.5),
      transform: 'translateY(-1px)'
    },
    danger: {
      transform: 'translateY(-2px)',
      boxShadow: `0 20px 25px -5px ${colors.withOpacity(colors.semantic.error, 0.15)}, 0 8px 10px -6px ${colors.withOpacity(colors.semantic.error, 0.1)}`
    },
    success: {
      transform: 'translateY(-2px)',
      boxShadow: `0 20px 25px -5px ${colors.withOpacity(colors.semantic.success, 0.15)}, 0 8px 10px -6px ${colors.withOpacity(colors.semantic.success, 0.1)}`
    }
  };

  return hoverStyles[variant];
}

/**
 * Get active/pressed styles for button variants
 */
function getActiveStyles(variant: ButtonVariant): React.CSSProperties {
  const activeStyles = {
    primary: {
      transform: 'translateY(0)',
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.aviation.primary, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.aviation.primary, 0.1)}`
    },
    secondary: {
      transform: 'translateY(0)',
      boxShadow: spacing.shadows.sm
    },
    ghost: {
      background: colors.withOpacity(colors.aviation.primary, 0.1),
      transform: 'translateY(0)'
    },
    danger: {
      transform: 'translateY(0)',
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.semantic.error, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.semantic.error, 0.1)}`
    },
    success: {
      transform: 'translateY(0)',
      boxShadow: `0 10px 15px -3px ${colors.withOpacity(colors.semantic.success, 0.1)}, 0 4px 6px -4px ${colors.withOpacity(colors.semantic.success, 0.1)}`
    }
  };

  return activeStyles[variant];
}

/**
 * Loading spinner component
 */
function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  const spinnerSize = spinnerSizes[size];

  return (
    <svg
      width={spinnerSize}
      height={spinnerSize}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 1s linear infinite'
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="31.416"
        style={{
          animation: 'spin-dash 2s ease-in-out infinite'
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes spin-dash {
            0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
            100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
          }
        `}
      </style>
    </svg>
  );
}

/**
 * Aviation Button Component
 * 
 * A comprehensive button component that follows the aviation design system.
 * Supports multiple variants, sizes, loading states, and icons.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Submit Form
 * </Button>
 * 
 * <Button variant="ghost" icon={<PlusIcon />} iconPosition="left">
 *   Add Item
 * </Button>
 * 
 * <Button variant="primary" loading>
 *   Processing...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      className = '',
      style,
      as = 'button',
      disabled,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const buttonStyles = getButtonStyles(variant, size, loading, fullWidth);
    
    let dynamicStyles: React.CSSProperties = buttonStyles;
    if (isPressed && !loading && !disabled) {
      dynamicStyles = { ...dynamicStyles, ...getActiveStyles(variant) };
    } else if (isHovered && !loading && !disabled) {
      dynamicStyles = { ...dynamicStyles, ...getHoverStyles(variant) };
    }

    const combinedStyles: React.CSSProperties = {
      ...dynamicStyles,
      ...style
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
      setIsHovered(true);
      onMouseEnter?.(e as any);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
      setIsHovered(false);
      setIsPressed(false);
      onMouseLeave?.(e as any);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsPressed(true);
      onMouseDown?.(e as any);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
      setIsPressed(false);
      onMouseUp?.(e as any);
    };

    const content = (
      <>
        {loading && <LoadingSpinner size={size} />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </>
    );

    const commonProps = {
      style: combinedStyles,
      className,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      disabled: disabled || loading
    };

    if (as === 'a') {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} {...(props as any)} {...commonProps}>
          {content}
        </a>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} {...(props as any)} {...commonProps}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Preset button components for common use cases
 */
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="secondary" />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="ghost" />
);

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="danger" />
);

export const SuccessButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="success" />
);