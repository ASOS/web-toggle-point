// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/ssrBackedReactContextFeaturesStoreFactory";

const featuresStore = featuresStoreFactory({
  toggleType: "config",
  logWarning: console.log
});

export default featuresStore;
