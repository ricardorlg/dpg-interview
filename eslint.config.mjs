import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { configs as wdio } from "eslint-plugin-wdio";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import mochaPlugin from "eslint-plugin-mocha";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  wdio["flat/recommended"],
  prettierRecommended,
  mochaPlugin.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "mocha/no-exports": "off",
      "mocha/no-setup-in-describe": "off",
      "mocha/no-pending-tests": "off",
      "mocha/no-hooks": "error",
      "mocha/consistent-spacing-between-blocks": "off",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
    },
  },
  {
    ignores: ["allure-report/**", "allure-results/**"],
  },
  {
    files: ["*spec.ts"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
);
