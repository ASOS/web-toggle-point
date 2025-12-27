import { lazy } from "react";
// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import deferredDynamicImportLoadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/deferredDynamicImportLoadStrategyFactory";

const adapterModuleSpecifier = import.meta.filename;

export const pack = (expression) => lazy(expression);

/**
 * A component load strategy factory to generate a load strategy using React's lazy function. Wraps the {@link module:web-toggle-point-webpack.deferredDynamicImportLoadStrategyFactory|deferredDynamicImportLoadStrategyFactory} from the Webpack package
 * @memberof module:web-toggle-point-react-pointcuts
 * @param {object} [options] options
 * @param {object} [options.importCodeGeneratorFactoryOptions] options for the code generator factory. see {@link module:web-toggle-point-webpack.deferredDynamicImportLoadStrategyFactory|deferredDynamicImportLoadStrategyFactory}
 * @param {string} [options.importCodeGeneratorFactoryOptions.webpackMagicComment] a magic comment prefixing the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import|dynamic import} statement. see {@link https://webpack.js.org/api/module-methods/#magic-comments|Webpack Magic Comments}
 * @returns {module:web-toggle-point-webpack.loadStrategy} a load strategy
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy|React.lazy}
 */
const lazyComponentLoadStrategyFactory = (options) =>
  /**
   * lazyComponentLoadStrategy
   * @implements module:web-toggle-point-webpack.loadStrategy
   */
  ({
    ...deferredDynamicImportLoadStrategyFactory(options),
    adapterModuleSpecifier
  });

export default lazyComponentLoadStrategyFactory;
