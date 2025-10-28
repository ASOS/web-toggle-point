import getRelevantModule from "./getRelevantModule";

const togglePoint = (joinPoint, featuresMap) => {
  return new Proxy(joinPoint.default, {
    get(_, ...rest) {
      const newTarget = getRelevantModule(joinPoint, featuresMap);
      return Reflect.get(newTarget.default, ...rest);
    }
  });
};

export default togglePoint;
