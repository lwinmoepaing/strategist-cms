/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  // clearMocks: true,
  testEnvironment: "node",
  verbose: true,
  forceExit: true,
  testMatch: ["**/**/*.test.ts"],
};
