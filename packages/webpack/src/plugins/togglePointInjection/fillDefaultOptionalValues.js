import { posix, basename } from "path";
import webpack from "webpack";

const fillDefaultPointcutValues = (pointCut) => {
  const {
    variantGlobs = ["./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}"],
    joinPointResolver = (variantPath) =>
      posix.resolve(variantPath, ...Array(4).fill(".."), basename(variantPath)),
    toggleHandler = "@asos/web-toggle-point-webpack/pathSegmentToggleHandler"
  } = pointCut;
  return {
    ...pointCut,
    variantGlobs,
    joinPointResolver,
    toggleHandler
  };
};

const fillDefaultOptionalValues = (options) => {
  return {
    webpackNormalModule: webpack.NormalModule,
    ...options,
    pointCuts: options.pointCuts.map(fillDefaultPointcutValues)
  };
};

export default fillDefaultOptionalValues;
