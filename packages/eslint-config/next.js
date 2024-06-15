const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
    require.resolve("@vercel/style-guide/eslint/next"),
  ],
  env: {
    node: true,
    browser: true,
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
      rules: {
        "import/order": [
          "error",
          {
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
            groups: [
              "external",
              "builtin",
              "index",
              "sibling",
              "parent",
              "internal",
              "object",
            ],
            "newlines-between": "always",
          },
        ],
        "prettier/prettier": [
          "error",
          {
            endOfLine: "auto",
            semi: true,
            singleQuote: true,
            trailingComma: "all",
          },
        ],
        "@typescript-eslint/consistent-type-imports": "error",
      },
    },
  ],
};
