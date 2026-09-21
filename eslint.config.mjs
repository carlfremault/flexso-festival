// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "gen/**",
      "_out/**",
      "target/**",
      "@cds-models/**",
      "db/data/**",
      "*.sqlite",
      "**/dist/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        cds: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Node.js builtins
            ["^node:"],

            // 2. External packages (react first for readability)
            ["^react", "^@?\\w"],

            // 3. CAP internal aliases (#cds-models/*, @sap/cds)
            ["^#", "^@sap/"],

            // 4. Internal Aliases & Absolute imports
            ["^@/"],

            // 5. Parent imports (../)
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],

            // 6. Relative imports (./)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

            // 7. Side effect & style imports
            ["^\\u0000", "^.+\\.(css|scss|less)$"],
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
