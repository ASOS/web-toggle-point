import { globalFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const featuresStore = featuresStoreFactory({ toggleType: "language" });

featuresStore.useValue({
  value: navigator.language || document.documentElement.lang
});

export default featuresStore;
