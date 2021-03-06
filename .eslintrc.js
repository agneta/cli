module.exports = {
  env: {
    es6: true,
    node: true,
  },
  plugins: ['node'],
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'node/exports-style': ['error', 'module.exports'],
    'no-process-exit': 'off',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'log'],
      },
    ],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_e_',
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
