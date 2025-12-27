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
 * Path Segment Toggle Handler Factory
 * @memberof module:web-toggle-point-webpack
 * @inner
 * @param {object} options toggle handler factory options
 * @param {function} options.togglePoint a method that chooses the appropriate module at runtime, passed a join points and a Map of feature keys to variants
 * @param {function} options.pack a method to pack a module (as returned by the join point) in preparation for use by the toggle point. This should be defined by the {@link module:web-toggle-point-webpack.loadStrategy|load strategy}.
 * @param {function} options.unpack a method to unpack a module when needed by the toggle point. This should be defined by the {@link module:web-toggle-point-webpack.loadStrategy|load strategy}.
 * @returns {module:web-toggle-point-webpack.pathSegmentToggleHandler} a toggle handler that takes a join point and a Map of feature keys to variants, and returns a module
 * @example
 * const pathSegmentToggleHandler = pathSegmentToggleHandlerFactory({
 *   togglePoint: ({ joinPoint, featuresMap, unpack }) => {
 *     const choseFeature = ... // toggle point logic, picking either the packed join point or a variant module
 *     return unpack(chosenFeature);
 *   }),
 *   pack: (moduleNamespace) => moduleNamespace(),
 *   unpack: (moduleNamespace) => moduleNamespace().default
 * });
 */
const pathSegmentToggleHandlerFactory = ({ togglePoint, pack, unpack }) => {
  /**
   * Path Segment Toggle Handler
   * @static
   * @memberof module:web-toggle-point-webpack
   * @param {object} params handler parameters
   * @param {module} params.joinPoint the join point
   * @param {Map} params.variantPathMap a Map of posix file paths, relative to the join point module, valued in a form defined by the loading strategy
   * @returns {function} A handler of join points injected by the plugin
   * @example
   * const result = pathSegmentToggleHandler({
   *    joinPoint: () => import("/src/some-base-module.js"),
   *    variantPathMap: new Map([
   *      ["/src/variants/some-variant-1.js", () => import("/src/variants/some-variant-1.js")],
   *      ["/src/variants/some-variant-2.js", () => import("/src/variants/some-variant-2.js")],
   *    ]),
   * });
   */
  const pathSegmentToggleHandler = ({ joinPoint, variantPathMap }) => {
    let featuresMap;
    for (const [key, value] of variantPathMap) {
      const parts = key.split("/").slice(0, -1).slice(2);
      featuresMap = buildTree(featuresMap, parts, pack(value));
    }
    return togglePoint({ joinPoint: pack(joinPoint), featuresMap, unpack });
  };

  return pathSegmentToggleHandler;
};

export default pathSegmentToggleHandlerFactory;
