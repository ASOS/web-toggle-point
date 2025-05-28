import dynamicLoadCodeGenerator from "./internal/dynamicLoadCodeGenerator";

export const unpack = (expression) => expression();

/**
 * A load strategy factory to generate a load strategy using a deferred (only called when a module is accessed) invocation of {@link https://webpack.js.org/api/module-methods/#import-1|dynamic module import}.
 * Unless an {@link https://webpack.js.org/api/module-methods/#webpackmode|"eager" webpackMode} is specified via the "webpackMagicComment" option, this will generate a separate chunk for each variant module.
 * @memberOf module:web-toggle-point-webpack
 * @param {object} [importCodeGeneratorFactoryOptions] options object
 * @param {string} [importCodeGeneratorFactoryOptions.webpackMagicComment] An optional {@link https://webpack.js.org/api/module-methods/#magic-comments|Webpack Magic Comment}.  This is a string that will be added to the import statement, and can be used to control how Webpack handles the import (e.g. prefetching, chunk names etc.).
 * @memberOf module:web-toggle-point-webpack
 * @returns {module:web-toggle-point-webpack.loadStrategy}
 */
const deferredDynamicImportLoadStrategyFactory = ({
  importCodeGeneratorOptions: { webpackMagicComment } = {}
} = {}) =>
  /**
   * @implements module:web-toggle-point-webpack.loadStrategy
   */
  ({
    adapterModuleSpecifier: import.meta.filename,
    importCodeGenerator: dynamicLoadCodeGenerator.bind(
      undefined,
      "import",
      webpackMagicComment
    )
  });

export default deferredDynamicImportLoadStrategyFactory;
