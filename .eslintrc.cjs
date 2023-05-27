module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'plugin:eslint-plugin-import/recommended',
    'eslint-config-airbnb',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/order': [
      'error',
      {
        pathGroups: [
          { pattern: 'react', group: 'builtin' },
          { pattern: 'vite', group: 'builtin' },
          { pattern: '~shared/**', group: 'internal' },
          { pattern: '~entities/**', group: 'internal' },
          { pattern: '~features/**', group: 'internal' },
          { pattern: '~widgets/**', group: 'internal' },
          { pattern: '~pages/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '~shared/*/*/**',
              '~entities/*/**',
              '~features/*/**',
              '~widgets/*/**',
              '~pages/*/**',
              '~app/**',
            ],
            message:
              'Direct access to the internal parts of the module is prohibited',
          },
          {
            group: [
              '../**/shared',
              '../**/entities',
              '../**/features',
              '../**/widgets',
              '../**/pages',
              '../**/app',
            ],
            message: 'Prefer absolute imports instead of relatives',
          },
        ],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['./vite.config.ts'] },
    ],
  },
  overrides: [
    {
      files: ['./src/**/*.ts', './src/**/*.tsx'],
      extends: [
        'plugin:eslint-plugin-import/typescript',
        'eslint-config-airbnb-typescript',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['tsconfig.json'],
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/indent': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
