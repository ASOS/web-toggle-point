import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import keepExternalComments from "./keepExternalComments.mjs";
import replace from "@rollup/plugin-replace";

const getCommon = ({ config_isClient }) => ({
  input: {
    main: "./src/index.js",
    lazyComponentLoadStrategyFactory:
      "./src/lazyComponentLoadStrategyFactory.js"
  },
  external: ["react/jsx-runtime"],
  plugins: [
    keepExternalComments,
    babel({
      exclude: [/node_modules/],
      babelHelpers: "runtime"
    }),
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    external(),
    ...[JSON.parse(config_isClient) ? terser() : []]
  ],
  preserveSymlinks: true
});

export default (args) => {
  const common = getCommon(args);
  return [
    {
      ...common,
      output: {
        dir: "lib/",
        exports: "named",
        format: "es",
        entryFileNames: "[name].js",
        sourcemap: true
      }
    },
    {
      ...common,
      output: {
        dir: "lib/",
        exports: "named",
        format: "cjs",
        entryFileNames: "[name].es5.cjs",
        sourcemap: true
      },
      plugins: [
        ...common.plugins,
        replace({
          preventAssignment: true,
          values: {
            "import.meta.filename": "__filename"
          }
        })
      ]
    }
  ];
};
