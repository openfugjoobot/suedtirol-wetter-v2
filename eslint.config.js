import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import svelteParser from 'svelte-eslint-parser';

export default [
  ...svelte.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser
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
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  {
    ignores: ['**/node_modules/', '**/build/', '**/.svelte/', '**/.git/']
  }
];