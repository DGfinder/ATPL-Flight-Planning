/**
 * Aviation Design System - Spacing
 * Single source of truth for all spacing, sizing, and layout values
 */

// Base spacing scale (rem units for scalability)
const spacingScale = {
  0: '0rem',
  px: '0.0625rem',  // 1px
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  18: '4.5rem',     // 72px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  88: '22rem',      // 352px
  96: '24rem',      // 384px
  128: '32rem'      // 512px
} as const;

export const spacing = {
  // Base spacing scale
  scale: spacingScale,

  // Component-specific spacing
  component: {
    // Button padding
    button: {
      xs: { x: spacingScale[2], y: spacingScale[1] },
      sm: { x: spacingScale[3], y: spacingScale[1.5] },
      md: { x: spacingScale[4], y: spacingScale[2] },
      lg: { x: spacingScale[6], y: spacingScale[3] },
      xl: { x: spacingScale[8], y: spacingScale[4] }
    },

    // Card padding and spacing
    card: {
      xs: spacingScale[3],
      sm: spacingScale[4],
      md: spacingScale[6],
      lg: spacingScale[8],
      xl: spacingScale[10]
    },

    // Input padding
    input: {
      xs: { x: spacingScale[2], y: spacingScale[1] },
      sm: { x: spacingScale[3], y: spacingScale[1.5] },
      md: { x: spacingScale[4], y: spacingScale[2] },
      lg: { x: spacingScale[4], y: spacingScale[3] }
    },

    // Navigation spacing
    nav: {
      item: { x: spacingScale[3], y: spacingScale[2] },
      gap: spacingScale[1]
    },

    // Layout spacing
    layout: {
      header: spacingScale[6],
      sidebar: spacingScale[4],
      content: spacingScale[6],
      section: spacingScale[8],
      container: spacingScale[6]
    }
  },

  // Border radius values
  radius: {
    none: '0',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadow depths
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000'
  }
} as const;

/**
 * Semantic spacing tokens for common use cases
 */
export const spacingTokens = {
  // Container max-widths
  containers: {
    xs: '20rem',      // 320px
    sm: '24rem',      // 384px
    md: '28rem',      // 448px
    lg: '32rem',      // 512px
    xl: '36rem',      // 576px
    '2xl': '42rem',   // 672px
    '3xl': '48rem',   // 768px
    '4xl': '56rem',   // 896px
    '5xl': '64rem',   // 1024px
    '6xl': '72rem',   // 1152px
    '7xl': '80rem',   // 1280px
    full: '100%'
  },

  // Screen breakpoints
  breakpoints: {
    xs: '20rem',      // 320px
    sm: '24rem',      // 384px
    md: '28rem',      // 448px
    lg: '32rem',      // 512px
    xl: '36rem',      // 576px
    '2xl': '42rem'    // 672px
  },

  // Common spacing patterns
  patterns: {
    // Stack spacing (vertical rhythm)
    stack: {
      xs: spacing.scale[2],
      sm: spacing.scale[4],
      md: spacing.scale[6],
      lg: spacing.scale[8],
      xl: spacing.scale[12]
    },

    // Inline spacing (horizontal rhythm)
    inline: {
      xs: spacing.scale[1],
      sm: spacing.scale[2],
      md: spacing.scale[4],
      lg: spacing.scale[6],
      xl: spacing.scale[8]
    },

    // Grid gaps
    grid: {
      xs: spacing.scale[2],
      sm: spacing.scale[4],
      md: spacing.scale[6],
      lg: spacing.scale[8],
      xl: spacing.scale[10]
    }
  },

  // Aviation-specific spacing
  aviation: {
    // Dashboard card spacing
    dashboard: {
      cardGap: spacing.scale[6],
      sectionGap: spacing.scale[8],
      containerPadding: spacing.scale[6]
    },

    // Navigation spacing
    sidebar: {
      width: '16rem',           // 256px
      collapsedWidth: '4rem',   // 64px
      itemPadding: spacing.scale[3],
      sectionGap: spacing.scale[4]
    },

    // Form spacing
    form: {
      fieldGap: spacing.scale[4],
      labelGap: spacing.scale[1.5],
      groupGap: spacing.scale[6]
    }
  }
} as const;

/**
 * CSS Custom Properties for spacing
 */
export const spacingCssVariables = {
  // Base scale
  '--spacing-0': spacing.scale[0],
  '--spacing-px': spacing.scale.px,
  '--spacing-1': spacing.scale[1],
  '--spacing-2': spacing.scale[2],
  '--spacing-3': spacing.scale[3],
  '--spacing-4': spacing.scale[4],
  '--spacing-6': spacing.scale[6],
  '--spacing-8': spacing.scale[8],
  '--spacing-12': spacing.scale[12],
  '--spacing-16': spacing.scale[16],
  '--spacing-20': spacing.scale[20],
  '--spacing-24': spacing.scale[24],
  '--spacing-32': spacing.scale[32],

  // Border radius
  '--radius-xs': spacing.radius.xs,
  '--radius-sm': spacing.radius.sm,
  '--radius-md': spacing.radius.md,
  '--radius-lg': spacing.radius.lg,
  '--radius-xl': spacing.radius.xl,
  '--radius-2xl': spacing.radius['2xl'],
  '--radius-full': spacing.radius.full,

  // Shadows
  '--shadow-xs': spacing.shadows.xs,
  '--shadow-sm': spacing.shadows.sm,
  '--shadow-md': spacing.shadows.md,
  '--shadow-lg': spacing.shadows.lg,
  '--shadow-xl': spacing.shadows.xl,
  '--shadow-2xl': spacing.shadows['2xl'],

  // Container widths
  '--container-xs': spacingTokens.containers.xs,
  '--container-sm': spacingTokens.containers.sm,
  '--container-md': spacingTokens.containers.md,
  '--container-lg': spacingTokens.containers.lg,
  '--container-xl': spacingTokens.containers.xl,
  '--container-2xl': spacingTokens.containers['2xl'],
  '--container-full': spacingTokens.containers.full
} as const;

/**
 * Utility functions
 */
export const spacingUtils = {
  /**
   * Get spacing value by scale key
   */
  getSpacing: (scale: keyof typeof spacing.scale) => spacing.scale[scale],

  /**
   * Create responsive spacing array
   */
  responsive: (base: keyof typeof spacing.scale, sm?: keyof typeof spacing.scale, md?: keyof typeof spacing.scale, lg?: keyof typeof spacing.scale) => ({
    base: spacing.scale[base],
    sm: sm ? spacing.scale[sm] : undefined,
    md: md ? spacing.scale[md] : undefined,
    lg: lg ? spacing.scale[lg] : undefined
  }),

  /**
   * Create padding object
   */
  padding: (x: keyof typeof spacing.scale, y: keyof typeof spacing.scale) => ({
    paddingLeft: spacing.scale[x],
    paddingRight: spacing.scale[x],
    paddingTop: spacing.scale[y],
    paddingBottom: spacing.scale[y]
  }),

  /**
   * Create margin object
   */
  margin: (x: keyof typeof spacing.scale, y: keyof typeof spacing.scale) => ({
    marginLeft: spacing.scale[x],
    marginRight: spacing.scale[x],
    marginTop: spacing.scale[y],
    marginBottom: spacing.scale[y]
  })
} as const;

/**
 * Type definitions
 */
export type SpacingScale = keyof typeof spacing.scale;
export type BorderRadius = keyof typeof spacing.radius;
export type Shadow = keyof typeof spacing.shadows;
export type Container = keyof typeof spacingTokens.containers;