module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.integration.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.integration.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@atoms/(.*)$': '<rootDir>/src/components/atoms/$1',
    '^@molecules/(.*)$': '<rootDir>/src/components/molecules/$1',
    '^@organisms/(.*)$': '<rootDir>/src/components/organisms/$1',
    '^@templates/(.*)$': '<rootDir>/src/components/templates/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
  },
};
