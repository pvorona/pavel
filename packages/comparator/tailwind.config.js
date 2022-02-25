const { join } = require('path')

module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          1: '#202124',
          2: '#303134',
          3: '#5f6368',
          text: '#e7eaed',
        },
      },
    },
  },
  plugins: [],
  content: [join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}')],
}
