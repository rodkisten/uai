import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";
export default [
  { ignores: ["dist/**", "public/r/**", "node_modules/**", "coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.{ts,tsx,js,mjs}"], languageOptions: { globals: { ...globals.browser, ...globals.node } }, rules: { "@typescript-eslint/no-explicit-any": "warn", "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], "no-empty": ["error", { allowEmptyCatch: true }] } },
  prettier,
];
