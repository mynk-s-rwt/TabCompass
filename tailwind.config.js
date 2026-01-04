/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Arc-inspired color system
        arc: {
          bg: {
            primary: '#1C1C1E',
            secondary: '#2C2C2E',
            tertiary: '#3A3A3C',
            elevated: '#38383A',
          },
          text: {
            primary: '#F5F5F7',
            secondary: '#98989D',
            tertiary: '#6E6E73',
          },
          accent: {
            blue: '#007AFF',
            purple: '#AF52DE',
            pink: '#FF2D55',
            red: '#FF3B30',
            orange: '#FF9500',
            yellow: '#FFCC00',
            green: '#34C759',
            teal: '#5AC8FA',
          },
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '14px', letterSpacing: '0.01em' }],
        'sm': ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        'base': ['13px', { lineHeight: '18px', letterSpacing: '0' }],
        'md': ['14px', { lineHeight: '20px', letterSpacing: '-0.01em' }],
        'lg': ['16px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
        'xl': ['20px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
        '2xl': ['24px', { lineHeight: '30px', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(0, 122, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(175, 82, 222, 0.3)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '40px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
