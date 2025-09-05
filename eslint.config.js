// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  // Your custom rules and overrides can go here.
  // For example, to enable React support:
  // react: true,
  node: true,
  // -------- Core Features --------

  // Enables stylistic rules for formatting.
  // Set to `true` to use Antfu's default style, or an object to customize.
  // Set to `false` to disable all stylistic rules if you only want error checking.

  stylistic: {
    indent: 2,
    quotes: 'single', // Use single quotes of string
    semi: true, // Use semicolons at the end of statements
    // This is the correct way to override stylistic rules
    overrides: {
      'style/brace-style': 'off',
    },
  },

  // These are for non-stylistic rules
  rules: {
    'no-console': 'off',
    'style/arrow-parens': 'off',
  },

  // For Svelte, Vue, etc., you can enable them here:
  // vue: true,
  // svelte: true,

  // By default, it automatically detects your environment.
  // You can manually specify if needed.
  typescript: true,
  jsonc: true,
  yml: true,

  // ... your other config
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.next/**',
  ],
});
