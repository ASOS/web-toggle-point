import { getFeatures } from "../featuresStore";
import { FEATURE_KEY } from "../constants";

const getRelevantModule = ({ joinPoint, featuresMap, unpack }) => {
  const activeFeatures = featuresMap.get(FEATURE_KEY);
  const { selection } = getFeatures();
  const variant = activeFeatures.get(selection);
  return unpack(variant ?? joinPoint);
};

export default getRelevantModule;
