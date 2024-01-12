module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh'],
  extends: [
    'plugin:eslint-plugin-import/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  env: { 
    browser: true, 
    es2020: true 
  },
  rules: {
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
    // typescript
    {
      files: ['./src/**/*.ts', './src/**/*.tsx'],
      extends: [
        'plugin:eslint-plugin-import/typescript',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['tsconfig.json'],
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/indent': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/msw/**',
              '**/react-query/utils.tsx',
              '**/react-router/utils.ts',
            ],
          },
        ],
      },
    },
    // tests
    {
      files: ['./src/**/*.test.ts', './src/**/*.test.tsx'],
      extends: ['plugin:testing-library/react'],
      rules: {
        'testing-library/no-debugging-utils': 'warn',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
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
