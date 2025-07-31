import { AsyncLocalStorage } from "async_hooks";

const globalSingleton = Symbol.for(
  "web-toggle-point-features.node-request-scoped-features-store"
);

/**
 * A factory function used to create a store for features, held in request-scoped global value.
 * Should only be used server-side, for anything user or request specific.
 * A thin wrapper around node {@link https://nodejs.org/api/async_context.html#class-asynclocalstorage|AsyncLocalStorage}, used as an extension point for future plugins.
 * @memberof module:web-toggle-point-features
 * @implements module:web-toggle-point-features.FeaturesStoreFactory
 * @param {object} params parameters
 * @param {string} params.toggleType The type of toggle in the store, which should be unique within a javascript realm.
 * @returns {module:web-toggle-point-features.nodeRequestScopedFeaturesStore} A store for features, scoped for the current request.
 */
const nodeRequestScopedFeaturesStoreFactory = ({ toggleType }) => {
  if (!Object.getOwnPropertySymbols(globalThis).includes(globalSingleton)) {
    globalThis[globalSingleton] = {};
  }
  if (!globalThis[globalSingleton][toggleType]) {
    const store = new AsyncLocalStorage();
    globalThis[globalSingleton][toggleType] = /**
     * @name nodeRequestScopedFeaturesStore
     * @memberof module:web-toggle-point-features
     * @implements module:web-toggle-point-features.FeaturesStore
     * @implements module:web-toggle-point-features.SingletonFeaturesStore
     */ {
      useValue: ({ value, scopeCallBack }) => {
        store.run(value, scopeCallBack);
      },
      getFeatures: () => {
        const features = store.getStore();
        if (features === undefined) {
          throw Error("Called outside of request context");
        }
        return features;
      }
    };
  }
  return globalThis[globalSingleton][toggleType];
};

export default nodeRequestScopedFeaturesStoreFactory;
