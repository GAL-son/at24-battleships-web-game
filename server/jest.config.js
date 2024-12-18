/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/tests/config/jest-env-setup.ts'],
};