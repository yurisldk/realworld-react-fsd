/**
 * @see https://jestjs.io/docs/configuration
 * @type {import("jest").Config}
 */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/shared/lib/test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest',
      { presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'] },
    ],
  },
  globals: {
    __API_URL__: '',
  },
  moduleNameMapper: {
    '^~app/(.*)$': '<rootDir>/src/app/$1',
    '^~pages/(.*)$': '<rootDir>/src/pages/$1',
    '^~widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^~features/(.*)$': '<rootDir>/src/features/$1',
    '^~entities/(.*)$': '<rootDir>/src/entities/$1',
    '^~shared/(.*)$': '<rootDir>/src/shared/$1',
    '\\.module\\.(css|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/src/shared/lib/test/__mocks__/svgMock.js',
  },
  testMatch: ['<rootDir>/src/**/*.{spec,test}.{ts,tsx,js,jsx}'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
};
