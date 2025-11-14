import { FEATURE_KEY } from "./constants";

export default ({ togglePoint, joinPoint, variantPathMap }) => {
  const variantsMap = new Map();
  for (const key of variantPathMap.keys()) {
    const [, feature] = key.match(/\/__variants__\/(.+?)\//);
    variantsMap.set(feature, variantPathMap.get(key));
  }
  const featuresMap = new Map([[FEATURE_KEY, variantsMap]]);
  return togglePoint(joinPoint, featuresMap);
};
