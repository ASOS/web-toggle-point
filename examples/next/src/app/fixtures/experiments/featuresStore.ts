"use client";

import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/reactContextFeaturesStoreFactory";

const reactContextStore = featuresStoreFactory({
  toggleType: "experiments"
});

export default reactContextStore;
