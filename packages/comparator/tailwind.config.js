const { join } = require('path')

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: [join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}')],
}
