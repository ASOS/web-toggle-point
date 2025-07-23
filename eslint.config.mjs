import asosConfig from "./peripheral/eslint-config-asosconfig/index.js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import markdown from "@eslint/markdown";
import workspaces from "eslint-plugin-workspaces";

const scripts = ["*.{js,mjs}", "**/*.{js,mjs}"];
const markDowns = ["*.md", "**/*.md"];

export default [
  workspaces.configs["flat/recommended"],
  ...asosConfig.map((config) => ({
    files: scripts,
    ignores: ["**/docs/**", "**/danger/**"],
    ...config,
    rules: {
      ...config.rules,
      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          endOfLine: "auto"
        }
      ]
    }
  })),
  {
    files: scripts,
    ...jsdoc.configs["flat/recommended"],
    rules: {
      "jsdoc/valid-types": "off" // Needed to allow JSDoc external: types (needed for documentation) in "mode:typescript" (needed for types)
    },
    languageOptions: {
      parserOptions: {
        requireConfigFile: false
      }
    }
  },
  {
    files: ["**/eslint.config.mjs"],
    rules: {
      "workspaces/no-relative-imports": "off",
      "workspaces/require-dependency": "off"
    }
  },
  {
    files: markDowns,
    plugins: { markdown },
    language: "markdown/gfm"
  },
  {
    files: ["dangerfile.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.node
    }
  }
];
