import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';

export default defineConfig([
  // Apply to all JS-related files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      // Use Node globals instead of browser globals so that process is defined
      globals: globals.node,
    },
  },
  // For .js files, set source type to CommonJS
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  // For .mjs files, set source type to module
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  // Apply recommended rules using @eslint/js plugin
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
]);
