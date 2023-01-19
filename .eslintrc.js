const { getESLintConfig } = require('@applint/spec');

module.exports = getESLintConfig('react-ts', {
  rules: {
    'id-length': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      typescript: {},
    },
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
});