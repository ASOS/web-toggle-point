import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import keepExternalComments from "./keepExternalComments.mjs";
import json from "@rollup/plugin-json";

export default {
  input: {
    plugins: "./src/plugins/index.js",
    "toggleHandlerFactories/pathSegment":
      "src/toggleHandlerFactories/pathSegment.js",
    "moduleLoadStrategyFactories/staticLoadStrategyFactory":
      "src/moduleLoadStrategyFactories/staticLoadStrategyFactory.js",
    "moduleLoadStrategyFactories/deferredRequireLoadStrategyFactory":
      "src/moduleLoadStrategyFactories/deferredRequireLoadStrategyFactory.js",
    "moduleLoadStrategyFactories/deferredDynamicImportLoadStrategyFactory":
      "src/moduleLoadStrategyFactories/deferredDynamicImportLoadStrategyFactory.js"
  },
  output: {
    dir: "lib/",
    entryFileNames: "[name].js",
    format: "es",
    sourcemap: true
  },
  plugins: [
    keepExternalComments,
    babel({
      exclude: [/node_modules/],
      babelHelpers: "runtime"
    }),
    resolve({
      preferBuiltins: true
    }),
    json(),
    commonjs(),
    external()
  ]
};
