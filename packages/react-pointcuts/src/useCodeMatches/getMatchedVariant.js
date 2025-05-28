const getMatchedVariant = ({ matchedFeatures, featuresMap, variantKey }) => {
  for (const [
    feature,
    { [variantKey]: variant, ...variables }
  ] of matchedFeatures) {
    const packedModule = featuresMap.get(feature)?.get(variant);
    if (packedModule) {
      return {
        packedModule,
        variables
      };
    }
  }

  return null;
};

export default getMatchedVariant;
