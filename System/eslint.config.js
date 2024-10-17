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
        childProcesses: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
  pluginJs.configs.recommended,
];