// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import featuresStoreFactory from "@asos/web-toggle-point-features/storeFactories/globalFeaturesStoreFactory";

const featuresStore = featuresStoreFactory();

const getEvent = () => {
  const dateString = new Intl.DateTimeFormat("en-GB").format(new Date());
  if (dateString.slice(0, 5) === "31/10") {
    return "halloween";
  }
  if (dateString.slice(0, 5) === "17/03") {
    return "st-patrick's-day";
  }
  if (dateString === "05/07/2025") {
    return "pride";
  }
};

featuresStore.setValue({ value: getEvent() });

export default featuresStore;
