/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito-sans': ["Nunito Sans"]
      },
      colors: {
        'warning': '#FF3D00',
        'bg-dark': {
          1000: '#131416',
          900: '#212326',
          800: '#2F3136',
          700: '#393B41',
          600: '#43454C',
          500: '#4C4F57',
          400: '#565962',
          300: '#5F636D',
          200: '#686D78',
          100: '#727783',
        },
        'text-dark': {
          DEFAULT: '#020D0B',
          1000: '#020D0B',
          900: '#1A2830',
          800: '#334047',
          700: '#4D585E',
          600: '#667075',
          500: '#80878C',
          400: '#999FA3',
          300: '#B3B7BA',
          200: '#CCCFD1',
          100: '#E5E7E8',
        },
        'text-white': {
          DEFAULT: '#F2F3F3',
          1000: '#969696',
          900: '#A1A1A1',
          800: '#ABABAB',
          700: '#B5B5B5',
          600: '#BFBFBF',
          500: '#C9C9C9',
          400: '#D3D4D4',
          300: '#DDDEDE',
          200: '#E7E8E8',
          100: '#F2F3F3',
        },
        'primary': {
          DEFAULT: '#00A2FF',
          1000: '#004166',
          900: '#006199',
          800: '#0082CC',
          700: '#00A2FF',
          600: '#33B5FF',
          500: '#4CBEFF',
          400: '#66C7FF',
          300: '#80D0FF',
          200: '#99DAFF',
          100: '#B2E3FF',
          light: '#00a2ff26', 
          dark: '#558BCD'
        },
        'border-dark': '#F2F3F3',
        'border-light': '#51555C'
      },
      screens: {
        'llg': '1440px'
      },
      boxShadow: {
        grey: "0px 8px 8px -4px rgba(24, 39, 75, 0.08), 0px 2px 6px 0px rgba(24, 39, 75, 0.12);"
      },
      fontSize: {
        '2xl': ['26px']
      },
      transition: {
        'left': 'left',
        'height': 'height'
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
}