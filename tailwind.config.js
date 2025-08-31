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
          primary: '#1E3A8A',
          secondary: '#1E40AF', 
          accent: '#3B82F6',
          light: '#DBEAFE',
          dark: '#1E293B'
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