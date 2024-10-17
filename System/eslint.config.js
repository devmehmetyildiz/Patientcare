const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  {
    ignores: [
      "node_modules/",
      "dist/**/*.js",
    ],
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        Sequelize: "readonly",
        db: "readonly",
        sequelize: "readonly",
        process: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^next$" }],
    },
  },
  pluginJs.configs.recommended,
];