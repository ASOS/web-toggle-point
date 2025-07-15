// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/globalFeaturesStoreFactory";

const featuresStore = featuresStoreFactory();

featuresStore.useValue({ value: new URL(document.URL).pathname.slice(1) });

export default featuresStore;
