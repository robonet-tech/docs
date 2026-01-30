import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import markdownPlugin from 'eslint-plugin-markdown'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    files: ['**/*.md'],
    plugins: {
      markdown: markdownPlugin
    },
    processor: 'markdown/markdown'
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**'
    ]
  }
]
