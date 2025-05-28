import { posix, basename } from "path";
import deferredRequireLoadStrategyFactory from "../../moduleLoadStrategyFactories/deferredRequireLoadStrategyFactory.js";

const defaultLoadStrategy = deferredRequireLoadStrategyFactory();

const fillDefaultPointcutValues = (pointCut) => {
  const {
    variantGlob = "./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}",
    joinPointResolver = (variantPath) =>
      posix.resolve(variantPath, ...Array(4).fill(".."), basename(variantPath)),
    toggleHandlerFactoryModuleSpecifier = "@asos/web-toggle-point-webpack/toggleHandlerFactories/pathSegment",
    loadStrategy = defaultLoadStrategy
  } = pointCut;
  return {
    ...pointCut,
    variantGlob,
    joinPointResolver,
    loadStrategy,
    toggleHandlerFactoryModuleSpecifier
  };
};

const fillDefaultOptionalValues = (options) => {
  return {
    webpackNormalModule: async () =>
      (await import("webpack")).default.NormalModule,
    ...options,
    pointCuts: options.pointCuts.map(fillDefaultPointcutValues)
  };
};

export default fillDefaultOptionalValues;
