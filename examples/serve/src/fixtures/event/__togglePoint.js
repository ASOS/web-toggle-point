import featuresStore from "./__featuresStore.js";

export default ({ joinPoint, featuresMap, unpack }) => {
  const event = featuresStore.getFeatures();
  if (featuresMap.has(event)) {
    return unpack(featuresMap.get(event)).default;
  }
  return unpack(joinPoint).default;
};
