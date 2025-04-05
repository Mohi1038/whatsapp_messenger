/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          primary: '#25D366',
          secondary: '#128C7E',
          light: '#DCF8C6',
          dark: '#075E54',
          gray: '#ECE5DD'
        }
      }
    },
  },
  plugins: [],
};