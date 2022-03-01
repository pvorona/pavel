const { join } = require('path')

module.exports = {
  theme: {
    extend: {
      animation: {
        success: 'success 1s',
      },
      keyframes: {
        success: {
          '0%': { 'background-color': 'rgb(22, 101, 52)' },
        },
      },
    },
  },
  plugins: [],
  content: [join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}')],
}
