/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@gc/eslint-config/react-internal.js'],
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    '.*.cjs',
    'tailwind.config.cjs',
    'postcss.config.js',
    'node_modules/*',
    'dist/*',
  ],
};
