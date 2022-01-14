module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  env: {
    'node': true
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    '@typescript-eslint/semi': ['warn', 'always'],
    '@typescript-eslint/no-extra-semi': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/comma-spacing': ['warn', { 'before': false, 'after': true }],
    'max-len': ['off', { 'code': 120 }],
    'no-continue': 'warn',
    'no-lonely-if': 'error',
    'no-multi-assign': 'warn',
    "indent": ["error", "tab", { "SwitchCase": 1 }],
    "@typescript-eslint/ban-ts-comment": 'off'
  }
};
