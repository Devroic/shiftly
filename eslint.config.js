const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'src/db/migrations/**'],
  },
  ...expoConfig,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // i18next's default export re-exposes its own instance methods (use, changeLanguage, ...)
      // as named exports for convenience — a known, intentional pattern this rule misreads as a bug.
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    // Plain Node config files loaded directly by tooling (not bundled by Metro), so CJS require() is correct here.
    files: ['*.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
