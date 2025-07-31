import { globalFeaturesStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const featuresStore = featuresStoreFactory({ toggleType: "config" });

featuresStore.useValue({ value: new URL(document.URL).pathname.slice(1) });

export default featuresStore;
