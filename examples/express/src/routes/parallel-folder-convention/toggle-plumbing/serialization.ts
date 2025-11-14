import { serializationFactory } from "@asos/web-toggle-point-ssr";
import { getFeatures } from "./featuresStore";

const { getScriptReactElement, getJSONFromScript } = serializationFactory({
  id: "features",
  logWarning: console.warn
});

const getFeaturesScript = () =>
  getScriptReactElement({ content: getFeatures() });

export { getFeaturesScript, getJSONFromScript };
