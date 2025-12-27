import withCodeSelectionPlugins from "./withCodeSelectionPlugins";
import withErrorBoundary from "./withErrorBoundary";
import { forwardRef } from "react";
import getDisplayName from "../getDisplayName";

const getControlOrVariant = ({
  matchedFeatures,
  matchedVariant,
  onVariantError,
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
    onVariantError,
    packedBaseModule,
    unpackComponent
  });

  return component;
};

const getComponent = (params) => {
  const onVariantError = (error) => {
    params.variantErrorPlugins.forEach(({ onVariantError }) => {
      Promise.resolve().then(() => {
        try {
          onVariantError(error);
        } catch {} // eslint-disable-line no-empty
      });
    });
  };

  let Component = getControlOrVariant({ ...params, onVariantError });

  const { codeSelectionPlugins, ...rest } = params;
  if (codeSelectionPlugins) {
    Component = withCodeSelectionPlugins({
      Component,
      codeSelectionPlugins,
      ...rest
    });
  }

  return Component;
};

export default getComponent;
