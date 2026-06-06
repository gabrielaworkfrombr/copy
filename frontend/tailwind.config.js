/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F11',
        surface: '#1A1A1F',
        border: '#2A2A30',
        primary: '#6366F1',
        'text-primary': '#F4F4F5',
        'text-secondary': '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
