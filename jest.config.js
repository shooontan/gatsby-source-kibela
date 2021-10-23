module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
