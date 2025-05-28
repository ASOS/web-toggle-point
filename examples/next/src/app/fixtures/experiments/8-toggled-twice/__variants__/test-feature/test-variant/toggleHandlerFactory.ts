import React from "react";
import { FEATURE_KEY } from "./constants";

type ReactComponentModuleType = { default: () => React.JSX.Element };
type DynamicReactComponentModuleType = () => Promise<ReactComponentModuleType>;
type LazyComponentType = React.LazyExoticComponent<() => React.JSX.Element>;

interface TogglePointFactory {
  togglePoint: ({
    joinPoint,
    featuresMap,
    unpack
  }: {
    joinPoint: LazyComponentType;
    featuresMap: Map<string, Map<string, LazyComponentType>>;
    unpack: (value: LazyComponentType) => LazyComponentType;
  }) => () => React.JSX.Element;
  pack: (value: DynamicReactComponentModuleType) => LazyComponentType;
  unpack: (value: LazyComponentType) => LazyComponentType;
}

interface TogglePoint {
  joinPoint: DynamicReactComponentModuleType;
  variantPathMap: Map<
    string,
    () => Promise<{ default: () => React.JSX.Element }>
  >;
}

export default ({ togglePoint, pack, unpack }: TogglePointFactory) =>
  ({ joinPoint, variantPathMap }: TogglePoint) => {
    const variantsMap = new Map<string, LazyComponentType>();
    const featuresMap = new Map([[FEATURE_KEY, variantsMap]]);

    for (const key of variantPathMap.keys()) {
      const packedValue = pack(variantPathMap.get(key)!);
      const [, , value] = key.split(".");
      const [start, end] = value.split("-");

      for (
        let charCode = start.charCodeAt(0);
        charCode <= end.charCodeAt(0);
        charCode++
      ) {
        variantsMap.set(String.fromCharCode(charCode), packedValue);
      }
    }

    return togglePoint({ joinPoint: pack(joinPoint), featuresMap, unpack });
  };
