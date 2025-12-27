import createVariantPathMap from "./createVariantPathMap";

const dynamicLoadCodeGenerator = (
  method,
  webpackMagicComment = "",
  { joinPointPath, variantPathMap }
) => `const joinPoint = () => ${method}(${webpackMagicComment}"${joinPointPath}");
${createVariantPathMap([...variantPathMap.keys()].map((key) => `  ["${key}", () => ${method}(${webpackMagicComment}"${variantPathMap.get(key)}")]`).join(",\n"))}`;

export default dynamicLoadCodeGenerator;
