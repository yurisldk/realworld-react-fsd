module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2020: true,
  },
  plugins: ['react-refresh'],
  extends: [
    'plugin:eslint-plugin-import/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'prettier',
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    '.eslintrc.cjs',
    'vite-env.d.ts',
    'vite.config.ts',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'react/destructuring-assignment': ['off'],
    'no-throw-literal': 'off',
    'consistent-return': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      { '': 'never', tsx: 'never', ts: 'never' },
    ],
    'import/order': [
      'error',
      {
        pathGroups: [
          { pattern: 'react', group: 'builtin' },
          { pattern: 'vite', group: 'builtin' },
          { pattern: '~shared/**', group: 'internal', position: 'before' },
          { pattern: '~entities/**', group: 'internal', position: 'before' },
          { pattern: '~features/**', group: 'internal', position: 'before' },
          { pattern: '~widgets/**', group: 'internal', position: 'before' },
          { pattern: '~pages/**', group: 'internal', position: 'before' },
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
  },
  overrides: [
    {
      files: [
        '*.ts',
        '.*.ts',
        './**/*.ts',
        './**/.*.ts',
        '*.tsx',
        '.*.tsx',
        './**/*.tsx',
        './**/.*.tsx',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
      },
      plugins: ['@typescript-eslint/eslint-plugin', '@typescript-eslint'],
      extends: [
        'plugin:eslint-plugin-import/typescript',
        'airbnb-typescript',
        'prettier',
      ],
      rules: {
        'react/require-default-props': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        'react/jsx-max-props-per-line': [
          'error',
          { maximum: 1, when: 'always' },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'variable',
            modifiers: ['destructured'],
            format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
          },
        ],
        'import/extensions': [
          'error',
          'ignorePackages',
          { '': 'never', tsx: 'never', ts: 'never' },
        ],
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/__tests__/**',
              '**/__mocks__/**',
              '**/*.test.ts',
              '**/*.test.tsx',
              '**/*.spec.ts',
              'src/shared/lib/test/setup.ts',
              'src/shared/lib/test/test.lib.tsx',
            ],
          },
        ],
      },
    },
  ],
}
