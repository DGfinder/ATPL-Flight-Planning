/**
 * Aviation Design System - Typography
 * Single source of truth for all typography definitions
 */

export const typography = {
  // Font Families with Robust Fallbacks
  fontFamilies: {
    primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
    heading: ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'Arial', 'sans-serif'],
    mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Droid Sans Mono', 'Consolas', 'monospace']
  },

  // Font Weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  // Font Sizes (rem units for scalability)
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem'     // 128px
  },

  // Line Heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const;

/**
 * Predefined typography scales for consistent text hierarchy
 */
export const textStyles = {
  // Display text (hero sections, major headings)
  display: {
    '2xl': {
      fontSize: typography.fontSizes['7xl'],
      lineHeight: typography.lineHeights.none,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    xl: {
      fontSize: typography.fontSizes['6xl'],
      lineHeight: typography.lineHeights.none,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    lg: {
      fontSize: typography.fontSizes['5xl'],
      lineHeight: typography.lineHeights.tight,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    md: {
      fontSize: typography.fontSizes['4xl'],
      lineHeight: typography.lineHeights.tight,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    sm: {
      fontSize: typography.fontSizes['3xl'],
      lineHeight: typography.lineHeights.tight,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    }
  },

  // Headings (page sections, card titles)
  heading: {
    h1: {
      fontSize: typography.fontSizes['3xl'],
      lineHeight: typography.lineHeights.tight,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    h2: {
      fontSize: typography.fontSizes['2xl'],
      lineHeight: typography.lineHeights.snug,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    h3: {
      fontSize: typography.fontSizes.xl,
      lineHeight: typography.lineHeights.snug,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    h4: {
      fontSize: typography.fontSizes.lg,
      lineHeight: typography.lineHeights.snug,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    h5: {
      fontSize: typography.fontSizes.base,
      lineHeight: typography.lineHeights.snug,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.heading.join(', ')
    },
    h6: {
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.snug,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamilies.heading.join(', ')
    }
  },

  // Body text (paragraphs, descriptions)
  body: {
    xl: {
      fontSize: typography.fontSizes.xl,
      lineHeight: typography.lineHeights.relaxed,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.primary.join(', ')
    },
    lg: {
      fontSize: typography.fontSizes.lg,
      lineHeight: typography.lineHeights.relaxed,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.primary.join(', ')
    },
    md: {
      fontSize: typography.fontSizes.base,
      lineHeight: typography.lineHeights.relaxed,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.primary.join(', ')
    },
    sm: {
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.primary.join(', ')
    },
    xs: {
      fontSize: typography.fontSizes.xs,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.primary.join(', ')
    }
  },

  // Labels and UI text (buttons, form labels, navigation)
  label: {
    lg: {
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.medium,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamilies.primary.join(', ')
    },
    md: {
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.medium,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.primary.join(', ')
    },
    sm: {
      fontSize: typography.fontSizes.xs,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.medium,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamilies.primary.join(', ')
    }
  },

  // Code and monospace text
  code: {
    md: {
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.mono.join(', ')
    },
    sm: {
      fontSize: typography.fontSizes.xs,
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamilies.mono.join(', ')
    }
  }
} as const;

/**
 * CSS Custom Properties for typography
 */
export const typographyCssVariables = {
  // Font families
  '--font-primary': typography.fontFamilies.primary.join(', '),
  '--font-heading': typography.fontFamilies.heading.join(', '),
  '--font-mono': typography.fontFamilies.mono.join(', '),

  // Font weights
  '--font-weight-light': typography.fontWeights.light.toString(),
  '--font-weight-normal': typography.fontWeights.normal.toString(),
  '--font-weight-medium': typography.fontWeights.medium.toString(),
  '--font-weight-semibold': typography.fontWeights.semibold.toString(),
  '--font-weight-bold': typography.fontWeights.bold.toString(),
  '--font-weight-extrabold': typography.fontWeights.extrabold.toString(),

  // Font sizes
  '--font-size-xs': typography.fontSizes.xs,
  '--font-size-sm': typography.fontSizes.sm,
  '--font-size-base': typography.fontSizes.base,
  '--font-size-lg': typography.fontSizes.lg,
  '--font-size-xl': typography.fontSizes.xl,
  '--font-size-2xl': typography.fontSizes['2xl'],
  '--font-size-3xl': typography.fontSizes['3xl'],
  '--font-size-4xl': typography.fontSizes['4xl'],
  '--font-size-5xl': typography.fontSizes['5xl'],
  '--font-size-6xl': typography.fontSizes['6xl'],

  // Line heights
  '--line-height-tight': typography.lineHeights.tight.toString(),
  '--line-height-snug': typography.lineHeights.snug.toString(),
  '--line-height-normal': typography.lineHeights.normal.toString(),
  '--line-height-relaxed': typography.lineHeights.relaxed.toString(),

  // Letter spacing
  '--letter-spacing-tight': typography.letterSpacing.tight,
  '--letter-spacing-normal': typography.letterSpacing.normal,
  '--letter-spacing-wide': typography.letterSpacing.wide,
} as const;

/**
 * Utility function to convert text style object to CSS string
 */
export function textStyleToCss(style: typeof textStyles.body.md): string {
  return Object.entries(style)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

/**
 * Type definitions
 */
export type TextStyle = typeof textStyles;
export type FontFamily = keyof typeof typography.fontFamilies;
export type FontWeight = keyof typeof typography.fontWeights;
export type FontSize = keyof typeof typography.fontSizes;
export type LineHeight = keyof typeof typography.lineHeights;