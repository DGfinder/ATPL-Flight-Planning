/**
 * Aviation Design System - Colors
 * Single source of truth for all color values in the application
 */

export const colors = {
  // Primary Aviation Colors
  aviation: {
    primary: '#1e3a8a',      // Deep navy blue (from logo background)
    secondary: '#dc2626',    // Professional red (from logo accent)
    accent: '#f8fafc',       // Clean white/light gray
    navy: '#0f172a',         // Darker navy for depth
    text: '#334155',         // Professional text gray
    light: '#f1f5f9',        // Subtle light backgrounds
    dark: '#0f172a',         // Deep navy for dark elements
    muted: '#64748b',        // Muted gray for secondary text
    border: '#e2e8f0'        // Subtle borders
  },

  // Semantic Colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },

  // Neutral Scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },

  // Base Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Color Utilities with Opacity
  withOpacity: (color: string, opacity: number) => `rgba(${hexToRgb(color)}, ${opacity})`,
} as const;

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Predefined color combinations for common use cases
 */
export const colorTokens = {
  // Background variations
  backgrounds: {
    primary: colors.aviation.primary,
    secondary: colors.aviation.light,
    accent: colors.aviation.accent,
    card: colors.white,
    elevated: colors.gray[50],
    dark: colors.aviation.navy
  },

  // Text variations
  text: {
    primary: colors.aviation.navy,
    secondary: colors.aviation.text,
    muted: colors.aviation.muted,
    light: colors.gray[400],
    inverse: colors.white,
    accent: colors.aviation.primary
  },

  // Border variations
  borders: {
    default: colors.aviation.border,
    light: colors.gray[200],
    medium: colors.gray[300],
    strong: colors.aviation.primary,
    success: colors.semantic.success,
    error: colors.semantic.error
  },

  // Interactive states
  interactive: {
    primary: {
      default: colors.aviation.primary,
      hover: '#1e40af',
      active: '#1d4ed8',
      disabled: colors.gray[300]
    },
    secondary: {
      default: colors.aviation.secondary,
      hover: '#dc2626',
      active: '#b91c1c',
      disabled: colors.gray[300]
    },
    ghost: {
      default: colors.transparent,
      hover: colors.withOpacity(colors.aviation.primary, 0.05),
      active: colors.withOpacity(colors.aviation.primary, 0.1),
      disabled: colors.transparent
    }
  },

  // Gradient definitions
  gradients: {
    primary: `linear-gradient(135deg, ${colors.aviation.primary} 0%, ${colors.aviation.secondary} 100%)`,
    header: `linear-gradient(135deg, ${colors.aviation.navy} 0%, ${colors.aviation.primary} 50%, ${colors.aviation.navy} 100%)`,
    background: `linear-gradient(135deg, ${colors.aviation.light} 0%, ${colors.white} 100%)`,
    card: `linear-gradient(135deg, ${colors.white} 0%, #fefefe 100%)`,
    subtle: `linear-gradient(135deg, ${colors.gray[50]} 0%, ${colors.white} 100%)`
  }
} as const;

/**
 * CSS Custom Properties for runtime theme switching
 */
export const cssVariables = {
  '--color-aviation-primary': colors.aviation.primary,
  '--color-aviation-secondary': colors.aviation.secondary,
  '--color-aviation-accent': colors.aviation.accent,
  '--color-aviation-navy': colors.aviation.navy,
  '--color-aviation-text': colors.aviation.text,
  '--color-aviation-light': colors.aviation.light,
  '--color-aviation-muted': colors.aviation.muted,
  '--color-aviation-border': colors.aviation.border,
  '--color-white': colors.white,
  '--color-black': colors.black,
  
  // Interactive states
  '--color-primary-hover': '#1e40af',
  '--color-primary-active': '#1d4ed8',
  '--color-secondary-hover': '#dc2626',
  '--color-secondary-active': '#b91c1c',
} as const;

/**
 * Type definitions for better TypeScript support
 */
export type AviationColor = keyof typeof colors.aviation;
export type SemanticColor = keyof typeof colors.semantic;
export type GrayScale = keyof typeof colors.gray;
export type ColorToken = typeof colors;