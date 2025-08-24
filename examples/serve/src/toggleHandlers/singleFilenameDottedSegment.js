export default ({ togglePoint, joinPoint, variantPathMap }) => {
  const featuresMap = new Map();
  for (const key of variantPathMap.keys()) {
    const [, , value] = key.split(".");
    featuresMap.set(value, variantPathMap.get(key));
  }
  return togglePoint(joinPoint, featuresMap);
};
