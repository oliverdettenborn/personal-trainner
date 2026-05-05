module.exports = {
  extends: ['universe/native', 'airbnb-base'],
  globals: {
    React: 'readonly',
    document: 'readonly',
    window: 'readonly',
    HTMLSelectElement: 'readonly',
    ClipboardItem: 'readonly',
  },
  overrides: [
    {
      files: ['cypress/**/*.ts', 'cypress.config.ts'],
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        chai: 'readonly',
      },
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  rules: {
    // Desabilitar Prettier (conflita com regras do Airbnb)
    'prettier/prettier': 'off',

    // Any is forbidden - NUNCA permitir
    '@typescript-eslint/no-explicit-any': 'error',

    // No unused vars
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Consistent type definitions (prefer type over interface)
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    // Array type style
    '@typescript-eslint/array-type': ['error', { default: 'array' }],

    // No console (except error and warn)
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Import extensions - não exigir .ts/.tsx
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],

    // Permitir dev dependencies em arquivos de teste e config
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.cy.ts',
          'cypress/**',
          'jest.*.js',
          '*.config.js',
          '*.config.ts',
        ],
      },
    ],

    // React specific - permitir JSX em .tsx
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],

    // Permitir props spreading em componentes
    'react/jsx-props-no-spreading': 'off',

    // Não exigir default export
    'import/prefer-default-export': 'off',

    // Relaxar max-len para 120 (Airbnb é 100)
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],

    // Permitir uso de StyleSheet.create antes da definição (padrão React Native)
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: false },
    ],

    // Não reclamar de React import em arquivos JSX/TSX (React 17+)
    'react/react-in-jsx-scope': 'off',

    // Permitir arrow functions sem return explícito
    'consistent-return': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
