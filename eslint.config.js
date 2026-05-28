import eslint from '@eslint/js';
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  eslint.configs.recommended,
  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  },
  {
    files: ['**/*.rules'],
    plugins: {
      'firebase-security-rules': firebaseRulesPlugin,
    },
    rules: {} // we will just let it parse with whatever default if anything
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
