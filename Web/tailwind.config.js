/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  iconMode: ['class', '[data-mode="icon"]'],
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'hovercolor': '#EA9458',
        'Contentbg': '#000',
        'Contentfg': '#191c24',
        'NavHoverbg': '#0f1015',
        'TextColor': '#6c7293',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'Common': ['Oswald', 'sans-serif'],
        'sideLogo': ['montserratsemibold'],
        'Logo': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'updownanimate': 'moveupdown 3s linear infinite',
      },
      keyframes: {
        moveupdown: {
             '0%': { rotate: '0deg' },
             '50%': { rotate: '90deg' },
             '100%': { rotate: '0deg' },
         /*  '0%, 100%': { transform: 'translate(0%)' },
          '50%': { transform: 'translate(100%)' }, */
        }
      }
    },
    plugins: [],
  }
}