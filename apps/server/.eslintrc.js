/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@strategist-cms/eslint-config/backend.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: ["jest.config.js", "**/*.test.ts"],
};
