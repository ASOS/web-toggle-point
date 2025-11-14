import examplesConfig from "../eslint.config.mjs";
import asosConfigReact from "../../peripheral/eslint-config-asosconfig/react.js";
import asosConfigServer from "../../peripheral/eslint-config-asosconfig/server.js";
import parser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  ...[...asosConfigReact, ...asosConfigServer].map((config) => ({
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ...config,
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./src/routes/parallel-folder-convention/tsconfig.json"
        }
      },
      react: {
        version: "detect"
      }
    },
    rules: {
      ...config.rules,
      "react/prop-types": "off",
      "prettier/prettier": [
        "error",
        {
          trailingComma: "none",
          endOfLine: "auto"
        }
      ]
    },
    languageOptions: {
      ...config.languageOptions,
      parser,
      globals: {
        CLIENT: "readonly",
        ...globals.browser,
        ...globals.node
      }
    }
  })),
  ...examplesConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "testing-library/no-render-in-lifecycle": "off",
      "no-console": "off"
    }
  }
];
