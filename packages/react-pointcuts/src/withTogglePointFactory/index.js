import { useMemo, forwardRef, Suspense, Fragment } from "react";
import getComponent from "./getComponent";
import useCodeMatches from "../useCodeMatches";
import getCodeSelectionPlugins from "../getCodeSelectionPlugins";
import { useDeferredValue } from "./useDeferredValueWhereAvailable";
import getDisplayName from "./getDisplayName";
import { isLazy, isValidElementType } from "react-is";

const isModuleLazyComponent = (Module) =>
  isValidElementType(Module) && isLazy(<Module />);

/**
 * @typedef {external.ReactComponentModuleNamespaceObject | function() : external.ReactComponentModuleNamespaceObject | function() : Promise<external.ReactComponentModuleNamespaceObject>} LoadWrappedReactComponentModule
 * @memberof web-toggle-point-react-pointcuts
 * @see {@link https://reactjs.org/docs/react-component.html|React.Component}
 */

/**
 * @typedef {external.ReactHookModuleNamespaceObject | function() : external.ReactHookModuleNamespaceObject | function() : Promise<external.ReactHookModuleNamespaceObject>} LoadWrappedReactHookModule
 * @memberof web-toggle-point-react-pointcuts
 * @see {@link https://reactjs.org/docs/hooks-overview.html|React.Hook}
 */

// eslint-disable-next-line prettier/prettier, no-empty -- https://github.com/babel/babel/issues/15156
{}
/**
 * A factory function used to create a withTogglePoint React Higher-Order-Component.
 * @memberof module:web-toggle-point-react-pointcuts
 * @inner
 * @function
 * @param {object} params parameters
 * @param {function} params.getActiveFeatures a method to get active features. Called honouring the rules of hooks.
 * @param {external:HostApplication.logError} params.logError a method that logs errors
 * @param {string} [params.variantKey='bucket'] A key use to identify a variant from the features data structure. Remaining members of the feature will be passed to the variant as props.
 * @param {Array<module:web-toggle-point-react-pointcuts~plugin>} [params.plugins] plugins to be used when toggling
 * Will be used when a toggled component throws an error that can be caught by an {@link https://reactjs.org/docs/error-boundaries.html|ErrorBoundary}.
 * When errors are caught, the control/base code will be used as the fallback component.
 * @returns {module:web-toggle-point-react-pointcuts.withTogglePoint} withTogglePoint React Higher-Order-Component.
 * @example
 * const withTogglePoint = withTogglePointFactory({
 *   getActiveFeatures,
 *   plugins: [plugin1, plugin2, plugin3],
 *   logError: (error) => window.NREUM?.noticeError(error)
 * });
 * export default withTogglePoint(MyReactComponent);
 */
const withTogglePointFactory = ({
  getActiveFeatures,
  logError,
  variantKey = "bucket",
  plugins
}) => {
  const codeSelectionPlugins = getCodeSelectionPlugins(plugins);

  /**
   * A React Higher-Order-Component that wraps a base / control component and swaps in a variant based on the active features supplied
   * @function withTogglePoint
   * @memberof module:web-toggle-point-react-pointcuts
   * @param {web-toggle-point-react-pointcuts.LoadWrappedReactComponentModule} joinPoint The joinPoint module, packed in a form defined by the loading strategy
   * @param {Map<string, Map<string, web-toggle-point-react-pointcuts.LoadWrappedReactComponentModule>>} featuresMap A map of features and their variants, with features as top-level keys and variants as nested keys with react component modules as the values, packed in a form defined by the loading strategy
   * @param {function} unpack a function that unpacks the module, returning a react component module
   * @returns {external:React.Component} Wrapped react component
   */
  const withTogglePoint = ({
    joinPoint: packedBaseModule,
    featuresMap,
    unpack
  }) => {
    const isLazyComponents = isModuleLazyComponent(packedBaseModule);
    const Wrapper = isLazyComponents
      ? ({ children }) => (
          <Suspense fallback={null}>{useDeferredValue(children)}</Suspense>
        )
      : Fragment;
    const unpackComponent = (packedModule) => {
      const unpacked = unpack(packedModule);
      return isLazyComponents ? unpacked : unpacked.default;
    };

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
            logError,
            packedBaseModule,
            unpackComponent,
            plugins: codeSelectionPlugins
          }),
        [matchedFeatures, matchedVariant]
      );

      return (
        <Wrapper>
          <Component {...props} ref={ref} />
        </Wrapper>
      );
    });

    WithTogglePoint.displayName = `withTogglePoint(${getDisplayName(packedBaseModule)})`;

    return WithTogglePoint;
  };

  return withTogglePoint;
};

export default withTogglePointFactory;
