import processVariantFiles from "./processVariantFiles/index.js";
import getVariantPaths from "./getVariantPaths.js";
import fillDefaultOptionalValues from "./fillDefaultOptionalValues.js";

const processPointCuts = async ({
  appRoot,
  fileSystem,
  options: { pointCuts }
}) => {
  const joinPointFiles = new Map();
  const configFiles = new Map();
  const warnings = [];
  for await (const pointCut of pointCuts.values()) {
    const { variantGlobs, joinPointResolver } =
      fillDefaultOptionalValues(pointCut);

    const variantPaths = await getVariantPaths({
      variantGlobs,
      appRoot,
      fileSystem
    });

    await processVariantFiles({
      variantPaths,
      joinPointFiles,
      pointCut,
      joinPointResolver,
      warnings,
      configFiles,
      fileSystem,
      appRoot
    });
  }

  return { warnings, joinPointFiles };
};

export default processPointCuts;
