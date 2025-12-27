export default ({ togglePoint, pack, unpack }) =>
  ({ joinPoint, variantPathMap }) => {
    const featuresMap = variantPathMap.keys().reduce((map, key) => {
      const [, , value] = key.split("/");
      const list = value.split(",");
      for (const value of list) {
        map.set(value, pack(variantPathMap.get(key)));
      }
      return map;
    }, new Map());
    return togglePoint({ joinPoint: pack(joinPoint), featuresMap, unpack });
  };
