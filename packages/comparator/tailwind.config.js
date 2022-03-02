const { join } = require('path')

module.exports = {
  theme: {
    extend: {
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
