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
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-var": "error",
    },
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
];
