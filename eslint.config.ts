import type { Linter } from 'eslint';

export default [
  {
    rules: {
      semi: ['error', 'always'],
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          semi: true,
        },
      ],
    },
  },
] satisfies Linter.Config[];
