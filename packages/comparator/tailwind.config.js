const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')
const { join } = require('path')

module.exports = {
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        gray: {
          main: {
            25: 'hsl(110, 5%, 25%)',
            45: 'hsl(110, 5%, 45%)',
          },

          2: 'hsl(220, 9%, 48%)',
          5: 'hsla(0, 0%, 0%, 0.1)',
          11: 'hsl(0, 0%, 15%)',
        },
      },
      boxShadow: {
        1: '0 0 0 1px hsl(0, 0%, 50%)',
        2: '0 0 0 1px hsl(0, 0%, 80%)',
        3: '0 0 0 1px var(--tw-shadow-color) inset;',
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
