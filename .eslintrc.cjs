/* eslint-disable prettier/prettier */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['prettier', 'airbnb'],
  plugins: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'linebreak-style': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'func-names': ['error', 'never'],
    'import/no-relative-packages': 'off',
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
        allowSeparatedGroups: true,
      },
    ],
    'import/extensions': ['error', 'never'],
    'import/no-unresolved': 'off',
    'no-magic-numbers': [
      'error',
      {
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        ignore: [0, 1],
      },
    ],
    curly: ['error', 'multi-line'],
    eqeqeq: ['error', 'smart'],
    'logical-assignment-operators': [
      'error',
      'always',
      { enforceForIfStatements: true },
    ],
    'require-await': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'wrap-iife': 'off',
    camelcase: ['error', { ignoreGlobals: true }],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'operator-linebreak': ['error', 'before'],
  },
};
