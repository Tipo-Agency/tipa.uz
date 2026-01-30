/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3337AD',
        'primary-dark': '#262985',
        accent: {
          coral: '#FF6B6B',
          turquoise: '#4ECDC4',
          sky: '#45B7D1',
          salmon: '#FFA07A',
          amethyst: '#9B59B6',
          yellow: '#F7DC6F',
          orange: '#FFD166',
          mint: '#A5DD9B',
          lavender: '#D4A5E9',
        },
        dark: '#050505',
        'dark-surface': '#0F0F0F',
        light: '#F4F4F9',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        marquee: 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee 25s linear infinite reverse',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.25rem',
          md: '1.5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};
