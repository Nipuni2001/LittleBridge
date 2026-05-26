/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'littlebridge-teal': {
          50: '#E8F5F3',
          100: '#C7E8E3',
          200: '#9FD9D0',
          300: '#76CABD',
          400: '#57BDAD',
          500: '#4A9B8E',
          600: '#3D8176',
          700: '#2F655D',
          800: '#224945',
          900: '#142D2C',
        },
        'littlebridge-yellow': {
          400: '#F4C430',
          500: '#E5B526',
        },
      },
    },
  },
  plugins: [],
}
