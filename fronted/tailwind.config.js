/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#3B5BDB',
          bg: '#EEF2FF',
          dark: '#5B7BFF',
          'dark-bg': '#1A2240',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F7F8FC',
          dark: '#161928',
          'dark-2': '#1C2035',
        },
        border: {
          DEFAULT: '#E4E6EF',
          2: '#D1D5E8',
          dark: '#272B42',
          'dark-2': '#333858',
        },
        text: {
          1: '#0F1120',
          2: '#4A4F6A',
          3: '#9098BC',
          'dark-1': '#E8EAFF',
          'dark-2': '#8B91B8',
          'dark-3': '#555C80',
        },
        success: {
          DEFAULT: '#2F9E44',
          bg: '#EBFBEE',
          dark: '#40C057',
          'dark-bg': '#0D2414',
        },
        warning: {
          DEFAULT: '#E67700',
          bg: '#FFF4E0',
          dark: '#FFA94D',
          'dark-bg': '#221600',
        },
        danger: {
          DEFAULT: '#C92A2A',
          bg: '#FFF0F0',
          dark: '#FF6B6B',
          'dark-bg': '#220D0D',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        'app': '12px',
        'app-sm': '8px',
      },
      boxShadow: {
        'app': '0 1px 3px rgba(15,17,32,.06), 0 4px 12px rgba(15,17,32,.05)',
        'app-md': '0 4px 16px rgba(15,17,32,.10), 0 1px 4px rgba(15,17,32,.06)',
      }
    },
  },
  plugins: [],
}
