import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/ssrBackedReactContextFeaturesStoreFactory";

const featuresStore = featuresStoreFactory({
  toggleType: "config",
  logWarning: console.log
});

export default featuresStore;
