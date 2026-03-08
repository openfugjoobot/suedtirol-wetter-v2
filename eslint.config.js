import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import ts from '@typescript-eslint/parser';
import svelteParser from 'svelte-eslint-parser';

export default [
  ...svelte.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: ts
      }
    },
    rules: {
      'svelte/no-unused-meta-options': 'warn',
      'svelte/no-unused-vars': 'warn',
      'svelte/valid-compile': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: ts,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      ...ts.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  {
    ignores: ['**/node_modules/', '**/build/', '**/.svelte/', '**/.git/']
  }
];
