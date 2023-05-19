/* eslint-disable */
export default {
  displayName: 'comparator-shared',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/comparator-shared',
  preset: '../../jest.preset.js',
}
