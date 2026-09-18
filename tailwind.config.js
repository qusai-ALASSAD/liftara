/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#070d1c', 900: '#0b1428', 800: '#111e3a', 700: '#1a2c52', 600: '#24406f' },
        royal: { 50: '#eef4ff', 100: '#dbe6ff', 200: '#bdd0ff', 300: '#8fb0ff', 400: '#5b85fb', 500: '#345ef0', 600: '#1f41d6', 700: '#1a34ab', 800: '#1a2f88', 900: '#1b2c6c' },
        moss: { 50: '#eefbf3', 100: '#d5f5e1', 300: '#84dfa8', 500: '#2fae68', 600: '#1f8c52', 700: '#1a6e43' },
        sand: { 50: '#f8f9fb', 100: '#f1f3f7', 200: '#e4e8ef', 300: '#cfd6e2', 400: '#a3aec1', 500: '#76839a' }
      },
      fontFamily: {
        display: ['Sora', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif']
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        card: '0 1px 2px rgba(11,20,40,.06), 0 8px 24px -12px rgba(11,20,40,.18)',
        lift: '0 12px 40px -16px rgba(31,65,214,.45)'
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        'pulse-ring': { '0%': { transform: 'scale(.95)', opacity: '.7' }, '70%': { transform: 'scale(1.25)', opacity: '0' }, '100%': { opacity: '0' } }
      },
      animation: { 'fade-up': 'fade-up .32s ease-out both', 'pulse-ring': 'pulse-ring 1.8s ease-out infinite' }
    }
  },
  plugins: []
};
