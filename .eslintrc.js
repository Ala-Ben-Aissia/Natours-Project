module.exports = {
   env: {
      browser: true,
      commonjs: true,
      // module: true,
      es2021: true,
      node: true,
   },
   extends: "eslint:recommended",
   parserOptions: {
      ecmaVersion: "latest",
   },
   rules: {
      "prefer-destructuring": ["warn", { object: true }],
      "no-unused-vars": "off",
      // "no-unused-vars": [
      // 	"warn",
      // 	{ argsIgnorePattern: "req|res|next|val|_" },
      // ],
      "no-undef": "error",
      "no-useless-escape": "off",
      "no-console": "warn",
      "no-empty": "warn",
   },
};
