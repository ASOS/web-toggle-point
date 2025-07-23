import featuresStore from "./__featuresStore.js";

export default ({ joinPoint, featuresMap, unpack }) => {
  const language = featuresStore.getFeatures();
  if (featuresMap.has(language)) {
    return unpack(featuresMap.get(language)).default;
  }
  return unpack(joinPoint).default;
};
