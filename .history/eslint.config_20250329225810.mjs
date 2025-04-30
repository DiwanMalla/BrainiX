// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
});

export default [
  js.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      "@next/next/no-img-element": "warn",
      "no-var": "error",
    },
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
];
