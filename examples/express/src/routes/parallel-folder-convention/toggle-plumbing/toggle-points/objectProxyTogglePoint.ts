import getRelevantModule from "./getRelevantModule";

const togglePoint = ({ joinPoint, featuresMap, unpack }) => {
  return new Proxy(unpack(joinPoint).default, {
    get(_, ...rest) {
      const newTarget = getRelevantModule({ joinPoint, featuresMap, unpack });
      return Reflect.get(newTarget.default, ...rest);
    }
  });
};

export default togglePoint;
