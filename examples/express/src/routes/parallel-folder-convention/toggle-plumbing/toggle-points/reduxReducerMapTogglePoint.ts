import getRelevantModule from "./getRelevantModule";

const togglePoint =
  ({ joinPoint, featuresMap, unpack }) =>
  (...args) =>
    getRelevantModule({ joinPoint, featuresMap, unpack }).default(...args);

export default togglePoint;
