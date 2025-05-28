export default ({ togglePoint, pack, unpack }) =>
  ({ joinPoint, variantPathMap }) => {
    const featuresMap = new Map();
    for (const key of variantPathMap.keys()) {
      const [, , value] = key.split(".");
      featuresMap.set(value, pack(variantPathMap.get(key)));
    }
    return togglePoint({ joinPoint: pack(joinPoint), featuresMap, unpack });
  };
