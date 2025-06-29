/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("eslint").ESLint.ConfigData}
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['prettier'],
  rules: {
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': 'warn',
    'react/react-in-jsx-scope': 'off',
    'no-param-reassign': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'import/extensions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/order': [
      'error',
      {
        pathGroups: [
          { pattern: 'react', group: 'builtin' },
          { pattern: '~shared/**', group: 'internal', position: 'before' },
          { pattern: '~entities/**', group: 'internal', position: 'before' },
          { pattern: '~features/**', group: 'internal', position: 'before' },
          { pattern: '~widgets/**', group: 'internal', position: 'before' },
          { pattern: '~pages/**', group: 'internal', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ['src/shared/lib/test/**/*.{js,ts,jsx,tsx}', 'cypress.config.ts', 'cypress/**'],
      rules: {
        'import/no-extraneous-dependencies': ['off'],
      },
    },
  ],
  ignorePatterns: ['.eslintrc.js'],
};
