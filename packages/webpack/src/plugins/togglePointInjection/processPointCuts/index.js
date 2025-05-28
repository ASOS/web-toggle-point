import processVariantFiles from "./processVariantFiles/index.js";
import getVariantFiles from "./getVariantFiles.js";

const processPointCuts = async ({
  appRoot,
  fileSystem,
  options: { pointCuts }
}) => {
  const joinPointFiles = new Map();
  const configFiles = new Map();
  const warnings = [];
  for await (const pointCut of pointCuts.values()) {
    const { variantGlob } = pointCut;
    const variantFiles = await getVariantFiles({
      variantGlob,
      appRoot,
      fileSystem
    });

    await processVariantFiles({
      variantFiles,
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
