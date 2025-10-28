import getRelevantModule from "./getRelevantModule";

const togglePoint =
  (joinPoint, featuresMap) =>
  (...args) =>
    getRelevantModule(joinPoint, featuresMap).default(...args);

export default togglePoint;
