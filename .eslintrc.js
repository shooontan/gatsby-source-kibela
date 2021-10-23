module.exports = {
  extends: ['@shooontan/eslint-config-ts'],
  overrides: [
    {
      files: ['gatsby-node.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
