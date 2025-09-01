import { colors, colorTokens, cssVariables } from '../colors';
import { typography, textStyles } from '../typography';
import { spacing, spacingTokens } from '../spacing';

/**
 * Design System Hook
 * 
 * Provides easy access to all design tokens and utilities
 * for consistent styling throughout the application
 */
export const useDesignSystem = () => {
  return {
    // Color tokens
    colors,
    colorTokens,
    cssVariables,
    
    // Typography tokens
    typography,
    textStyles,
    
    // Spacing tokens
    spacing,
    spacingTokens,
    
    // Utility functions
    withOpacity: colors.withOpacity,
    
    // Common style combinations
    styles: {
      // Text styles
      heading: {
        fontFamily: typography.fontFamilies.heading.join(', '),
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.025em'
      },
      
      body: {
        fontFamily: typography.fontFamilies.primary.join(', '),
        lineHeight: 1.6,
        color: colors.aviation.text
      },
      
      caption: {
        fontFamily: typography.fontFamilies.primary.join(', '),
        fontSize: '0.875rem',
        color: colors.aviation.muted
      },
      
      // Layout styles
      container: {
        maxWidth: '80rem',
        margin: '0 auto',
        padding: `0 ${spacing.scale[4]}`
      },
      
      section: {
        padding: `${spacing.scale[8]} 0`
      },
      
      // Interactive styles
      button: {
        borderRadius: spacing.radius.lg,
        fontWeight: 600,
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      },
      
      card: {
        borderRadius: spacing.radius.xl,
        boxShadow: spacing.shadows.md,
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
      },
      
      input: {
        borderRadius: spacing.radius.lg,
        border: `1px solid ${colors.gray[200]}`,
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
    },
    
    // Animation utilities
    animations: {
      fadeIn: {
        animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      },
      
      slideIn: {
        animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      },
      
      scaleIn: {
        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }
    },
    
    // Responsive utilities
    responsive: {
      mobile: '@media (max-width: 767px)',
      tablet: '@media (min-width: 768px) and (max-width: 1023px)',
      desktop: '@media (min-width: 1024px)'
    }
  };
};

export default useDesignSystem;
