import useCodeMatches from "../useCodeMatches";
import pluginsHookFactory from "./pluginsHookFactory";
import getHooksFromPlugins from "../getHooksFromPlugins";

// eslint-disable-next-line prettier/prettier, no-empty -- https://github.com/babel/babel/issues/15156
{
}
/**
 * A factory function used to create a withToggledHook React hook, wrapping an existing hook/function.
 * @memberof module:web-toggle-point-react-pointcuts
 * @inner
 * @function
 * @param {object} params parameters
 * @param {function} params.getActiveFeatures a method to get active features, which is called honouring the rules of hooks.
 * @param {string} [params.variantKey='bucket'] A key use to identify a variant from the features data structure. Remaining members of the feature will be passed to the variant as props.
 * @param {Array<module:web-toggle-point-react-pointcuts~plugin>} [params.plugins] plugins to be used when toggling
 * @returns {module:web-toggle-point-react-pointcuts.withToggledHook} withToggledHook hook function, use to wrap a function (either a hook itself, or a function that must be called wherever a hook can...).
 * @example
 * const getActiveFeatures = () => useContext(myContext);
 * const withToggledHook = withToggledHookFactory({
 *   getActiveFeatures,
 *   plugins: [plugin1, plugin2, plugin3]
 * });
 * export default withToggledHook(useMyHook);
 */
const withToggledHookFactory = ({
  getActiveFeatures,
  variantKey = "bucket",
  plugins
}) => {
  const useCodeSelectionPlugins = pluginsHookFactory(
    getHooksFromPlugins(plugins, "onCodeSelected")
  );

  /**
   * A React hook that wraps a base / control function or hook and swaps in a variant based on the active features supplied
   * @function withToggledHook
   * @memberof module:web-toggle-point-react-pointcuts
   * @param {ReactHookModuleNamespaceObject} controlModule The control / base module
   * @param {(external:React.Hook|function)} controlModule.default The control react hook or function.
   * @param {Map<string, Map<string, ReactHookModuleNamespaceObject>>} featuresMap A map of features and their variants, with features as top-level keys and variants as nested keys with modules as the values.
   * @returns {external:React.Hook} Wrapped function / hook, as a hook (so must be applied in accordance with the {@link https://reactjs.org/docs/hooks-rules.html|rules of hooks})
   */
  const withToggledHook = (controlModule, featuresMap) => {
    const useTogglePoint = (...args) => {
      const activeFeatures = getActiveFeatures();
      const { matchedVariant } = useCodeMatches({
        featuresMap,
        variantKey,
        activeFeatures
      });

      useCodeSelectionPlugins?.(...args);

      const { default: hook } = matchedVariant?.codeRequest ?? controlModule;

      return hook(...args);
    };

    return useTogglePoint;
  };

  return withToggledHook;
};

export default withToggledHookFactory;
