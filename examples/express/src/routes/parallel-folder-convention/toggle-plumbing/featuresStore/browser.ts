import { proxy, useSnapshot } from "valtio";
import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/globalFeaturesStoreFactory";
import { getJSONFromScript } from "../serialization";

const { setValue: storeSetValue, getFeatures } = featuresStoreFactory({
  toggleType: "version"
});

storeSetValue({ value: proxy({}) });
export const setValue = (input) => {
  storeSetValue({
    value: Object.assign(getFeatures(), input)
  });
};

export { getFeatures };
export const useFeatures = () => ({ feature: useSnapshot(getFeatures()) });

const { selection } = getJSONFromScript();
setValue({ selection });
