const { join } = require('path')

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          1: 'hsl(210deg, 2%, 55%)',
          2: 'hsl(220deg, 9%, 48%)',
          3: 'hsla(270, 0%, 35%, 0.6)',
          4: 'hsl(225, 4%, 20%)',
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
