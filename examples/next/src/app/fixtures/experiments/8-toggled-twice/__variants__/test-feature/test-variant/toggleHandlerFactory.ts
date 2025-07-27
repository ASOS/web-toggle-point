import React from "react";
import { FEATURE_KEY } from "./constants";
import type { RequireContext } from "webpack-env";

type ReactComponentModuleType = {
  default: React.Component;
};
interface ToggleHandler {
  togglePoint: (
    joinPoint: ReactComponentModuleType,
    featuresMap: Map<string, Map<string, ReactComponentModuleType>>
  ) => React.Component;
  joinPoint: ReactComponentModuleType;
  variants: RequireContext;
}

export default ({ togglePoint, joinPoint, variants }: ToggleHandler) => {
  const variantsMap = new Map<string, ReactComponentModuleType>();
  const featuresMap = new Map([[FEATURE_KEY, variantsMap]]);

  for (const key of variants.keys()) {
    const [, , value] = key.split(".");
    const [start, end] = value.split("-");

    for (
      let charCode = start.charCodeAt(0);
      charCode <= end.charCodeAt(0);
      charCode++
    ) {
      variantsMap.set(String.fromCharCode(charCode), variants(key));
    }
  }

  return togglePoint(joinPoint, featuresMap);
};
