import { useMemo } from "react";
import getMatchedVariant from "./getMatchedVariant";
import getMatchedFeatures from "./getMatchedFeatures";

const useCodeMatches = ({ activeFeatures, variantKey, featuresMap }) => {
  const serializedActiveFeatures = JSON.stringify(activeFeatures);

  const matches = useMemo(() => {
    const matchedFeatures = getMatchedFeatures({
      activeFeatures,
      featuresMap
    });
    const matchedVariant = getMatchedVariant({
      matchedFeatures,
      featuresMap,
      variantKey
    });

    return {
      matchedFeatures,
      matchedVariant
    };
  }, [serializedActiveFeatures]); // eslint-disable-line react-hooks/exhaustive-deps

  return matches;
};

export default useCodeMatches;
