/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aviation: {
          // Sophisticated palette matching favicon.png
          primary: '#1e3a8a',     // Deep navy blue (from logo background)
          secondary: '#dc2626',   // Professional red (from logo accent)
          accent: '#f8fafc',      // Clean white/light gray
          navy: '#0f172a',        // Darker navy for depth
          text: '#334155',        // Professional text gray
          light: '#f1f5f9',       // Subtle light backgrounds
          dark: '#0f172a',        // Deep navy for dark elements
          muted: '#64748b',       // Muted gray for secondary text
          border: '#e2e8f0'       // Subtle borders
        },
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
        green: {
          50: '#f0fdf4',
          500: '#22c55e'
        },
        red: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626'
        },
        blue: {
          200: '#bfdbfe'
        },
        white: '#ffffff'
      }
    },
  },
  plugins: [],
}