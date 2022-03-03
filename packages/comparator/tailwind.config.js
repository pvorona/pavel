const { join } = require('path')

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          1: 'hsl(210deg, 2%, 55%)',
          2: 'hsl(220deg, 9%, 48%)',
        },
      },
      animation: {
        success: 'success .45s',
      },
      keyframes: {
        success: {
          '0%': { 'background-color': 'hsla(175, 100%, 75%, 0.75)' },
        },
      },
    },
  },
  plugins: [],
  content: [join(__dirname, '**/*.{js,ts,jsx,tsx}')],
}
