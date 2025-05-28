import featuresStore from "./__featuresStore.js";

export default async ({ joinPoint, featuresMap, unpack }) => {
  const audience = featuresStore.getFeatures();
  if (audience && featuresMap.has(audience)) {
    return (await unpack(featuresMap.get(audience))).default();
  }
  return (await unpack(joinPoint)).default();
};
