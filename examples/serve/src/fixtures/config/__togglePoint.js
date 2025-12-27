import featuresStore from "./__featuresStore.js";

export default ({ joinPoint, featuresMap, unpack }) => {
  const site = featuresStore.getFeatures();
  if (featuresMap.has(site)) {
    return unpack(featuresMap.get(site)).default;
  }
  return unpack(joinPoint).default;
};
