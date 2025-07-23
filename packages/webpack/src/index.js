import "./external.js";

/**
 * Webpack code for injecting toggle points
 * @module web-toggle-point-webpack
 */
export { TogglePointInjectionPlugin } from "./plugins";

/**
 * A function that generates code to load modules
 * @callback importCodeGenerator
 * @memberof module:web-toggle-point-webpack
 * @param {object} args
 * @param {string} args.joinPointPath the path to the join point module
 * @param {Map<string, string>} args.variantPathMap a Map of relative (to the joinPointPath) file paths to absolute file paths, for each potential variant module
 * @returns {string}
 * @example
 * const joinPointPath = "/src/some-base-module.js";
 * const variantPathMap = new Map([
 *  ["/src/variants/some-variant-1.js", "/src/variants/some-variant-1.js"],
 *  ["/src/variants/some-variant-2.js", "/src/variants/some-variant-2.js"],
 * ]);
 * importCodeGenerator({ joinPointPath, variantPathMap });
 * // output (for a contrived static load strategy compatible only with CommonJS chunk format):
 * // `import * as joinPoint from "/src/some-base-module.js";
 * // const variantPathMap = new Map([
 * //   ["/src/variants/some-variant-1.js", require("/src/variants/some-variant-1.js")],
 * //   ["/src/variants/some-variant-2.js", require("/src/variants/some-variant-2.js")],
 * // ]);`
 */
/**
 * A module load strategy. This is used to load the modules that contain the join point module and its variants
 * @interface loadStrategy
 * @memberof module:web-toggle-point-webpack
 * @property {string} adapterModuleSpecifier - The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_features_into_your_script|module specifier} of the adapter module. This optionally exports "pack" and "unpack" functions. The module specifier is used to import the namespace into the compilation.
 * @property {module:web-toggle-point-webpack.importCodeGenerator} importCodeGenerator - A function that generates the code to load the modules.
 */
