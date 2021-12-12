// last update 2021/3/11
// https://gist.github.com/ken20001207/d7dcdf1e482e48fe3fbf3f6a8c3ffaa2/
// yarn add eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

module.exports = {
    env: {browser: true},
    extends: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        /** Disable rules */
        'no-unused-vars': 'off',
        'no-invalid-this': 'off',
        'require-jsdoc': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',

        /** Basic */
        'max-len': [
            'warn', 80, {
                ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
                ignoreUrls: true
            }
        ],
        'quote-props': ['warn', 'consistent-as-needed'],
        'indent': ['warn', 2],
        'quotes': ['warn', 'single'],
        'semi': ["warn", "always"],
        '@typescript-eslint/no-unused-vars': 'warn',

        /** Naming Conversation */
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                selector: 'variable',
                types: ['boolean'],
                format: ['PascalCase'],
                prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'ok'],
            },
        ],

        /** Object */
        'object-curly-newline': ['warn', {multiline: true}],
        'object-curly-spacing': ['warn', 'always'],

        /** Array */
        'array-element-newline': ['warn', 'consistent'],
        'array-bracket-newline': ['warn', {multiline: true}],

        /** Spaces */
        'no-trailing-spaces': 'warn',
        'space-in-parens': ['warn', 'never'],
    },
};