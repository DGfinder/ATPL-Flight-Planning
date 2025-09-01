import React from 'react';
import { colors, colorTokens } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

/**
 * Button Component Props
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Button Variant Types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Aviation Button Component
 * 
 * Professional button with consistent aviation styling using inline CSS
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style,
  ...props
}) => {
  // Base button styles
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.scale[2],
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: spacing.radius.lg,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: typography.fontFamilies.primary.join(', '),
    ...style
  };

  // Size variations
  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: {
      padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
      fontSize: '0.75rem',
      minHeight: '2rem'
    },
    md: {
      padding: `${spacing.scale[2.5]} ${spacing.scale[4]}`,
      fontSize: '0.875rem',
      minHeight: '2.5rem'
    },
    lg: {
      padding: `${spacing.scale[3]} ${spacing.scale[5]}`,
      fontSize: '1rem',
      minHeight: '3rem'
    }
  };

  // Variant styles
  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: colorTokens.gradients.primary,
      color: colors.white,
      boxShadow: spacing.shadows.md
    },
    secondary: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      color: colors.aviation.text,
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: spacing.shadows.sm
    },
    ghost: {
      background: colors.transparent,
      color: colors.aviation.primary,
      border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.3)}`
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: colors.white,
      boxShadow: spacing.shadows.md
    },
    success: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: colors.white,
      boxShadow: spacing.shadows.md
    }
  };

  // Hover effects (unused in current implementation)
  // const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  //   primary: {
  //     transform: 'translateY(-1px)',
  //     boxShadow: spacing.shadows.lg
  //   },
  //   secondary: {
  //     background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  //     transform: 'translateY(-1px)',
  //     boxShadow: spacing.shadows.md,
  //     borderColor: colors.withOpacity(colors.aviation.primary, 0.3)
  //   },
  //   ghost: {
  //     background: colors.withOpacity(colors.aviation.primary, 0.05),
  //     borderColor: colors.withOpacity(colors.aviation.primary, 0.5),
  //     transform: 'translateY(-1px)'
  //   },
  //   danger: {
  //     transform: 'translateY(-1px)',
  //     boxShadow: spacing.shadows.lg
  //   },
  //   success: {
  //     transform: 'translateY(-1px)',
  //     boxShadow: spacing.shadows.lg
  //   }
  // };

  // Disabled styles
  const disabledStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: spacing.shadows.sm
  };

  // Combine all styles
  const combinedStyles: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(disabled ? disabledStyle : {}),
    ...(loading ? { pointerEvents: 'none' } : {})
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <div style={{
      width: '1rem',
      height: '1rem',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  );

  return (
    <button
      type={type}
      style={combinedStyles}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

/**
 * Convenience Components
 */
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="success" {...props} />
);

export default Button;