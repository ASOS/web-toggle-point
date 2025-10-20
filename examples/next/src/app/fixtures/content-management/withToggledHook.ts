"use client";

import { withToggledHookFactory } from "@asos/web-toggle-point-react-pointcuts";
import featuresStore from "./featuresStore";

const { getFeatures } = featuresStore;

const withTogglePoint = withToggledHookFactory({
  getActiveFeatures: getFeatures,
  logError: console.log,
  variantKey: "status"
});

export default withTogglePoint;
