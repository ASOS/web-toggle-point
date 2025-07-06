import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import keepExternalComments from "./keepExternalComments.js";
import { readdir } from "node:fs/promises";

export default async ({ config_isBrowser }) => {
  const isBrowser = JSON.parse(config_isBrowser);

  const browserPrefix = isBrowser ? "browser." : "";

  const input = (await readdir("./src/storeFactories"))
    .filter((file) => !file.endsWith(".test.js"))
    .filter((file) => !(file.startsWith("node") && isBrowser))
    .map((factory) => `./src/storeFactories/${factory}`);

  return {
    input,
    output: [
      {
        dir: "lib/",
        entryFileNames: `[name].${browserPrefix}js`,
        format: "es",
        sourcemap: true
      },
      {
        dir: "lib/",
        entryFileNames: `[name].${browserPrefix}es5.cjs`,
        format: "cjs",
        sourcemap: true
      }
    ],
    external: ["react/jsx-runtime"],
    plugins: [
      keepExternalComments,
      babel({
        exclude: /node_modules/,
        babelHelpers: "runtime"
      }),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      external(),
      isBrowser ? [terser()] : []
    ],
    preserveSymlinks: true
  };
};
