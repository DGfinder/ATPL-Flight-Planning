/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      // Aviation color system - simplified for Tailwind v4 compatibility
      colors: {
        aviation: {
          primary: '#1e3a8a',
          secondary: '#dc2626',
          accent: '#f8fafc',
          navy: '#0f172a',
          text: '#334155',
          light: '#f1f5f9',
          muted: '#64748b',
          border: '#e2e8f0'
        }
      },
      
      // Typography system
      fontFamily: {
        'primary': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      
      // Enhanced animations
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      
      // Aviation shadow system
      boxShadow: {
        'aviation': '0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -4px rgba(30, 58, 138, 0.1)',
        'aviation-lg': '0 20px 25px -5px rgba(30, 58, 138, 0.15), 0 8px 10px -6px rgba(30, 58, 138, 0.1)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      
      // Extended spacing for aviation components
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Extended border radius
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Container sizes
      maxWidth: {
        'aviation': '80rem',
      },
      
      // Z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  
  // Custom plugins for aviation utilities
  plugins: [
    // Plugin for aviation-specific utilities
    function({ addUtilities }) {
      const aviationUtilities = {
        '.container-aviation': {
          'max-width': '80rem',
          'margin': '0 auto',
          'padding': '0 1.5rem',
        },
        '.section-aviation': {
          'padding': '2rem 0',
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        }
      }
      
      addUtilities(aviationUtilities)
    }
  ],
  
  // Safelist important classes for dynamic usage
  safelist: [
    'aviation-card',
    'aviation-button',
    'aviation-input',
    'hover-lift',
    'hover-scale',
    'fade-in',
    'scale-in',
    'slide-in',
    // Dynamic aviation color classes
    'text-aviation-primary',
    'text-aviation-secondary',
    'text-aviation-navy',
    'text-aviation-muted',
    'bg-aviation-primary',
    'bg-aviation-secondary',
    'bg-aviation-light',
    'border-aviation-primary',
    'border-aviation-border',
  ]
}