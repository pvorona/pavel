/* eslint-disable */
export default {
  displayName: 'components',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/components',
  preset: '../../jest.preset.js',
}
