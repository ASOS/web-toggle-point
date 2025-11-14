// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/nodeRequestScopedFeaturesStoreFactory";
const { setValue, getFeatures } = featuresStoreFactory({
  toggleType: "version"
});

export { getFeatures, setValue };
export const useFeatures = () => ({ feature: getFeatures() });
