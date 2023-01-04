/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(unit).[jt]s?(x)'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/?(*.)+(integration|e2e).[jt]s?(x)',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/*.config.{js,ts}',
    '!**/dist/**',
    '!jest.integrationConfig.js',
    '!jest.e2eConfig.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'html', 'json', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  verbose: true
};
