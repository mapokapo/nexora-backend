import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  {
    ignores: ["node_modules", "dist", "eslint.config.mjs"],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      perfectionist,
    },
    settings: {
      perfectionist: {
        type: "natural",
        fallbackSort: "line-length",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "perfectionist/sort-imports": "warn",
    },
  }
);
