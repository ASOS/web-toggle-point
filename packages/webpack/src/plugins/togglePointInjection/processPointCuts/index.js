import processVariantFiles from "./processVariantFiles/index.js";
import getVariantPaths from "./getVariantPaths.js";

const processPointCuts = async ({
  appRoot,
  fileSystem,
  options: { pointCuts }
}) => {
  const joinPointFiles = new Map();
  const configFiles = new Map();
  const warnings = [];
  for await (const pointCut of pointCuts.values()) {
    const { variantGlobs } = pointCut;

    const variantPaths = await getVariantPaths({
      variantGlobs,
      appRoot,
      fileSystem
    });

    await processVariantFiles({
      variantPaths,
      joinPointFiles,
      pointCut,
      warnings,
      configFiles,
      fileSystem,
      appRoot
    });
  }

  return { warnings, joinPointFiles };
};

export default processPointCuts;
