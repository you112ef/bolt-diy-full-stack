const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: __dirname, // Path to Next.js app
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Handle module aliases
  },
}

module.exports = createJestConfig(customJestConfig)
