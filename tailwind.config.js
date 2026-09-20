/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF1E8', 100: '#FFE2D1', 200: '#FFC6A3', 300: '#FFA470', 400: '#FF8838',
          500: '#FF6B00', 600: '#E95600', 700: '#C24700', 800: '#993800', 900: '#7A2E00'
        },
        ink: {
          50: '#F7F8FA', 100: '#F2F4F7', 200: '#E5E7EB', 300: '#D0D5DD', 400: '#98A2B3',
          500: '#667085', 600: '#475467', 700: '#2B3542', 800: '#202834', 900: '#18202A', 950: '#0F151C'
        },
        success: { 50: '#EAF7EF', 100: '#D3F0DE', 500: '#16A34A', 600: '#12833B', 700: '#0E6630' },
        warn: { 50: '#FEF6E7', 100: '#FDECCB', 500: '#D97706', 600: '#B45309' },
        anat: {
          skin: '#F2D6C2', skinShade: '#E3C0A8', muscle: '#D98C7A',
          muscleDeep: '#C2705E', tendon: '#F7EBE1', outline: '#8C5A4B'
        }
      },
      fontFamily: {
        display: ['Sora', 'Noto Sans Arabic Variable', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'Noto Sans Arabic Variable', 'system-ui', 'sans-serif']
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem', '3xl': '1.75rem', '4xl': '2.25rem' },
      boxShadow: {
        card: '0 1px 2px rgba(24,32,42,.05), 0 10px 26px -18px rgba(24,32,42,.35)',
        raised: '0 2px 6px rgba(24,32,42,.06), 0 18px 40px -24px rgba(24,32,42,.4)',
        cta: '0 10px 26px -10px rgba(255,107,0,.55)'
      },
      maxWidth: { app: '30rem', frame: '76rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'none' } },
        'pulse-ring': { '0%': { transform: 'scale(.95)', opacity: '.7' }, '70%': { transform: 'scale(1.25)', opacity: '0' }, '100%': { opacity: '0' } }
      },
      animation: {
        'fade-up': 'fade-up .32s ease-out both',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite'
      }
    }
  },
  plugins: []
};
