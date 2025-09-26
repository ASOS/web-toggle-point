export default ({ togglePoint, joinPoint, variantPathMap }) => {
  const featuresMap = variantPathMap.keys().reduce((map, key) => {
    const [, , value] = key.split("/");
    const list = value.split(",");
    for (const value of list) {
      map.set(value, variantPathMap.get(key));
    }
    return map;
  }, new Map());
  return togglePoint(joinPoint, featuresMap);
};
