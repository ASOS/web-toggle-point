const buildTree = (map = new Map(), parts, value) => {
  const [part, ...rest] = parts;
  if (rest.length) {
    map.set(part, buildTree(map.get(part), rest, value));
  } else {
    map.set(part, value);
  }
  return map;
};

/**
 * Path Segment Toggle Handler
 * @memberof module:web-toggle-point-webpack
 * @inner
 * @param {object} options plugin options
 * @param {function} options.togglePoint a method that chooses the appropriate module at runtime
 * @param {module} options.joinPoint the join point module
 * @param {Map} params.variantPathMap a Map of posix file paths, relative to the join point module, to variant modules
 * @returns {function} A handler of join points injected by the plugin
 */
const pathSegmentToggleHandler = ({
  togglePoint,
  joinPoint,
  variantPathMap
}) => {
  let featuresMap;
  for (const [key, value] of variantPathMap) {
    const parts = key.split("/").slice(0, -1).slice(2);
    featuresMap = buildTree(featuresMap, parts, value);
  }
  return togglePoint(joinPoint, featuresMap);
};

export default pathSegmentToggleHandler;
