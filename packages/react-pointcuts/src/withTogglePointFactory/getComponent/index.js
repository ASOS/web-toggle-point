import withPlugins from "./withPlugins";
import withErrorBoundary from "./withErrorBoundary";
import { forwardRef } from "react";
import getDisplayName from "../getDisplayName";

const getControlOrVariant = ({
  matchedFeatures,
  matchedVariant,
  logError,
  packedBaseModule,
  unpackComponent
}) => {
  if (!matchedFeatures.length || !matchedVariant) {
    return unpackComponent(packedBaseModule);
  }

  const { packedModule, variables } = matchedVariant;
  const VariantWithoutVariables = unpackComponent(packedModule);
  const Variant = forwardRef((props, ref) => (
    <VariantWithoutVariables {...{ ...variables, ...props, ref }} />
  ));
  Variant.displayName = `Variant(${getDisplayName(VariantWithoutVariables)})`;

  const component = withErrorBoundary({
    Variant,
    logError,
    packedBaseModule,
    unpackComponent
  });

  return component;
};

const getComponent = (params) => {
  let component = getControlOrVariant(params);

  const { plugins, ...rest } = params;
  if (plugins) {
    component = withPlugins({
      component,
      plugins,
      ...rest
    });
  }

  return component;
};

export default getComponent;
