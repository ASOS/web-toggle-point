"use client";

import { reactContextFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const reactContextStore = featuresStoreFactory({
  toggleType: "experiments"
});

export default reactContextStore;
