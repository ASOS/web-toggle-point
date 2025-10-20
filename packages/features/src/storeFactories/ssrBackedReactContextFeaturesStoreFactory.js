import { withJsonIsomorphism } from "@asos/web-toggle-point-ssr";
import reactContextFeaturesStoreFactory from "./reactContextFeaturesStoreFactory";

/**
 * A factory function used to create a store for features, held in a {@link https://reactjs.org/docs/context.html|React context}, backed by server-side rendering.
 * A wrapper around a {@link module:web-toggle-point-features.reactContextFeaturesStore|reactContextFeaturesStore}, with server-side rendering supplied by the {@link module:web-toggle-point-ssr|toggle-point-ssr} package.
 * @memberof module:web-toggle-point-features
 * @implements module:web-toggle-point-features.FeaturesStoreFactory
 * @param {object} params parameters
 * @param {string} [params.namespace="toggles"] The namespace for the script tag used to inject the initial state into the client-side application.
 * @param {string} params.toggleType The type of toggle in the store, used for debugging, display name of the react context provider, the script name of the json script and the prop name used to pass the value to the provider.
 * @param {function} params.logWarning A function to log warnings, used to highlight any malformed JSON in-case this is processed outside of the SSR process.
 * @returns {module:web-toggle-point-features.ssrBackedReactContextFeaturesStore} A store for features, held within a {@link https://reactjs.org/docs/context.html|React context}.
 */
const ssrBackedReactContextFeaturesStoreFactory = ({
  namespace = "toggles",
  toggleType,
  logWarning
}) => {
  const { providerFactory, ...rest } = reactContextFeaturesStoreFactory({
    toggleType
  });

  /**
   * @name ssrBackedReactContextFeaturesStore
   * @memberof module:web-toggle-point-features
   * @implements module:web-toggle-point-features.FeaturesStore
   * @implements module:web-toggle-point-features.ContextFeaturesStore
   */
  return {
    providerFactory: () => {
      const FeaturesProvider = providerFactory();
      const SSRBackedFeaturesProvider = withJsonIsomorphism(
        ({ children, [toggleType]: value }) => (
          <FeaturesProvider value={value}>{children}</FeaturesProvider>
        ),
        logWarning,
        {
          scriptId: `${namespace}_${toggleType}`,
          propName: toggleType
        }
      );
      return ({ children, value }) => (
        <SSRBackedFeaturesProvider {...{ [toggleType]: value }}>
          {children}
        </SSRBackedFeaturesProvider>
      );
    },
    ...rest
  };
};

export default ssrBackedReactContextFeaturesStoreFactory;
