const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')
const { join } = require('path')

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          1: 'hsl(210, 2%, 55%)',
          2: 'hsl(220, 9%, 48%)',
          3: 'hsla(270, 0%, 35%, 0.6)',
          4: 'hsl(225, 4%, 25%)',
          5: 'hsla(0, 0%, 0%, 0.1)',
          6: 'hsl(225, 6%, 13%)',
          7: 'hsla(270, 0%, 35%, 0.2)',
        },
      },
      boxShadow: {
        1: '0 0 0 1px hsl(0, 0%, 50%)',
        2: '0 0 0 1px hsl(0, 0%, 80%)',
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
  content: [
    join(__dirname, '**/!(*.stories|*.spec).{js,ts,jsx,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
}
