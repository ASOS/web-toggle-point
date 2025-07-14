import { useMemo, forwardRef } from "react";
import getComponent from "./getComponent";
import useCodeMatches from "../useCodeMatches";
import getHooksFromPlugins from "../getHooksFromPlugins";

// eslint-disable-next-line prettier/prettier, no-empty -- https://github.com/babel/babel/issues/15156
{}
/**
 * A factory function used to create a withTogglePoint React Higher-Order-Component.
 * @memberof module:web-toggle-point-react-pointcuts
 * @inner
 * @function
 * @param {object} params parameters
 * @param {function} params.getActiveFeatures a method to get active features. Called honouring the rules of hooks.
 * @param {string} [params.variantKey=bucket] A key use to identify a variant from the features data structure. Remaining members of the feature will be passed to the variant as props.
 * @param {Array<module:web-toggle-point-react-pointcuts~plugin>} [params.plugins] plugins to be used when toggling.
 * Any plugins that include a 'onVariantError' hook will be called when a toggled component throws an error that can be caught by an {@link https://reactjs.org/docs/error-boundaries.html|ErrorBoundary}.
 * When errors are caught, the control/base code will be used as the fallback component.
 * @returns {module:web-toggle-point-react-pointcuts.withTogglePoint} withTogglePoint React Higher-Order-Component.
 * @example
 * const withTogglePoint = withTogglePointFactory({
 *   getActiveFeatures,
 *   plugins: [
 *     somePlugin,
 *     {
 *       onCodeSelected: ({ matchedFeatures }) => { console.log("matched: " + JSON.stringify(matchedFeatures)) }); },
 *     },
 *     {
 *       onVariantError: console.error
 *     }
 *   ]
 * });
 * export default withTogglePoint(MyReactComponent);
 */
const withTogglePointFactory = ({
  getActiveFeatures,
  variantKey = "bucket",
  plugins = []
}) => {
  const codeSelectionPlugins = getHooksFromPlugins(plugins, "onCodeSelected");
  const variantErrorPlugins = getHooksFromPlugins(plugins, "onVariantError");

  /**
   * A React Higher-Order-Component that wraps a base / control component and swaps in a variant when deemed appropriate by a context
   * @function withTogglePoint
   * @memberof module:web-toggle-point-react-pointcuts
   * @param {ReactComponentModuleNamespaceObject} controlModule The control / base module
   * @param {external:React.Component} controlModule.default The control react component
   * @param {Map} featuresMap A map of features and their variants, with features as top-level keys and variants as nested keys with modules as the values.
   * @returns {external:React.Component} Wrapped react component
   */
  const withTogglePoint = (controlModule, featuresMap) => {
    const { default: control } = controlModule;
    const WithTogglePoint = forwardRef((props, ref) => {
      const activeFeatures = getActiveFeatures();
      const { matchedFeatures, matchedVariant } = useCodeMatches({
        featuresMap,
        variantKey,
        activeFeatures
      });

      const Component = useMemo(
        () =>
          getComponent({
            matchedFeatures,
            matchedVariant,
            control,
            codeSelectionPlugins,
            variantErrorPlugins
          }),
        [matchedFeatures, matchedVariant]
      );

      return <Component {...props} ref={ref} />;
    });

    WithTogglePoint.displayName = `withTogglePoint(${
      control.displayName || control.name || "Component"
    })`;

    return WithTogglePoint;
  };

  return withTogglePoint;
};

export default withTogglePointFactory;
