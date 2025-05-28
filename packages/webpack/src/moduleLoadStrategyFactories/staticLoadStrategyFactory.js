import createVariantPathMap from "./internal/createVariantPathMap.js";

const adapterModuleSpecifier = import.meta.filename;

const importCodeGenerator = ({ joinPointPath, variantPathMap }) => {
  const variantsKeys = Array.from(variantPathMap.keys());
  return `import * as joinPoint from "${joinPointPath}";
${variantsKeys
  .map(
    (key, index) =>
      `import * as variant_${index} from "${variantPathMap.get(key)}";`
  )
  .join("\n")}
${createVariantPathMap(variantsKeys.map((key, index) => `  ["${key}", variant_${index}]`).join(",\n"))}`;
};

/**
 * A load strategy factory to generate a load strategy using a {@link https://webpack.js.org/api/module-methods/#import|static (eagerly called) import} of the join point and its variants.
 * N.B. As a consequence, the side-effects of all variations and the join point will be executed as soon as the entry point of the chunk in which the code sits is loaded.
 * @memberOf module:web-toggle-point-webpack
 * @returns {module:web-toggle-point-webpack.loadStrategy}
 */
const staticLoadStrategyFactory = () =>
  /**
   * @implements {module:web-toggle-point-webpack.loadStrategy}
   */
  ({
    adapterModuleSpecifier,
    importCodeGenerator
  });

export default staticLoadStrategyFactory;
