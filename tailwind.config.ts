import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#3B6EFA',
          600: '#2D5BE8',
          700: '#1E46CC',
          900: '#0D1F5C',
        },
        warm: {
          50: '#fefaf5',
          100: '#fdf3e3',
        },
        accent: '#FF5C3A',
        success: '#1DBF73',
        warning: '#FFB020',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}

export default config

