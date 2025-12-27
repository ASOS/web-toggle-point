import dynamicLoadCodeGenerator from "./internal/dynamicLoadCodeGenerator";

export const unpack = (expression) => expression();

/**
 * A load strategy factory to generate a load strategy using a deferred (only called when a module is accessed) invocation of {@link https://webpack.js.org/api/module-methods/#require|Webpack's require module method}.
 * @memberOf module:web-toggle-point-webpack
 * @returns {module:web-toggle-point-webpack.loadStrategy}
 */
const deferredRequireLoadStrategyFactory = () =>
  /**
   * @implements {module:web-toggle-point-webpack.loadStrategy}
   */
  ({
    adapterModuleSpecifier: import.meta.filename,
    importCodeGenerator: dynamicLoadCodeGenerator.bind(
      undefined,
      "require",
      undefined
    )
  });

export default deferredRequireLoadStrategyFactory;
