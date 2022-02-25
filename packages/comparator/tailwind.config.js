const { join } = require('path')

module.exports = {
  theme: {
    extend: {},
  },
  plugins: [],
  content: [join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}')],
}
