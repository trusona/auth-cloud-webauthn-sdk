module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resetMocks: true,
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      { tsconfig: './tsconfig.spec.json' }
    ]
  }
}
