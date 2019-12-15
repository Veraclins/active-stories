module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },

  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testMatch: [
    '**/test/**/*.test.(ts)',
    '**/src/**/test/**/*.test.(ts)',
  ],
  moduleDirectories: ['node_modules', 'src'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testEnvironment: 'node',
};
