module.exports = {
  displayName: 'chart-demo',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/chart-demo',
  preset: '../../jest.preset.ts',
}
