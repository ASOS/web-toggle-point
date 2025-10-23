import { getFeatures } from "../featuresStore";
import { FEATURE_KEY } from "../constants";

const getRelevantModule = (joinPoint, featuresMap) => {
  const activeFeatures = featuresMap.get(FEATURE_KEY);
  const { selection } = getFeatures();
  const variant = activeFeatures.get(selection);
  return variant ?? joinPoint;
};

export default getRelevantModule;
