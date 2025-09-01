/**
 * Aviation Design System
 * Single source of truth for all visual design tokens and components
 */

// Import design tokens for internal usage
import { colors, colorTokens, cssVariables } from './colors';
import { typography, textStyles, typographyCssVariables } from './typography';
import { spacing, spacingTokens, spacingCssVariables } from './spacing';

// Re-export design tokens
export { colors, colorTokens, cssVariables, type AviationColor, type SemanticColor, type GrayScale } from './colors';
export { typography, textStyles, typographyCssVariables, textStyleToCss, type TextStyle, type FontFamily, type FontWeight, type FontSize, type LineHeight } from './typography';
export { spacing, spacingTokens, spacingCssVariables, spacingUtils, type SpacingScale, type BorderRadius, type Shadow, type Container } from './spacing';

// Components
export { 
  Button, 
  PrimaryButton, 
  SecondaryButton, 
  GhostButton, 
  DangerButton, 
  SuccessButton,
  type ButtonProps, 
  type ButtonVariant, 
  type ButtonSize 
} from './components/Button';

export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  InteractiveCard,
  ElevatedCard,
  GradientCard,
  OutlineCard,
  type CardProps, 
  type CardVariant, 
  type CardPadding,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps
} from './components/Card';

export {
  Layout,
  type LayoutProps
} from './components/Layout';

export {
  Sidebar,
  type SidebarProps
} from './components/Sidebar';

export {
  Header,
  Breadcrumb,
  MobileMenuButton,
  type HeaderProps,
  type BreadcrumbProps,
  type BreadcrumbItem
} from './components/Header';

/**
 * Design System Theme
 * Complete theme configuration for consistent styling
 */
export const aviationTheme = {
  colors,
  colorTokens,
  typography,
  textStyles,
  spacing,
  spacingTokens,
  shadows: spacing.shadows,
  radius: spacing.radius,
  gradients: colorTokens.gradients
} as const;

/**
 * CSS Variables for Runtime Theming
 * All design tokens as CSS custom properties
 */
export const allCssVariables = {
  ...cssVariables,
  ...typographyCssVariables,
  ...spacingCssVariables
} as const;

/**
 * Utility function to inject CSS variables into document
 * Useful for ensuring design tokens are available globally
 */
export function injectDesignTokens(target: HTMLElement = document.documentElement) {
  Object.entries(allCssVariables).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}

/**
 * Design System Hook
 */
export { useDesignSystem } from './hooks/useDesignSystem';

/**
 * Type exports for better TypeScript support
 */
export type AviationTheme = typeof aviationTheme;
export type DesignToken = keyof typeof allCssVariables;