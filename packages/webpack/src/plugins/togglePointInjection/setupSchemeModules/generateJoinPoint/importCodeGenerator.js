import createVariantPathMap from "./createVariantPathMap.js";

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

export default importCodeGenerator;
