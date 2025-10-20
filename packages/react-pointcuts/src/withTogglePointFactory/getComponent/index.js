import withCodeSelectionPlugins from "./withCodeSelectionPlugins";
import withErrorBoundary from "./withErrorBoundary";
import { forwardRef } from "react";

const getControlOrVariant = ({
  matchedFeatures,
  matchedVariant,
  onVariantError,
  control
}) => {
  if (!matchedFeatures.length) {
    return control;
  }

  let Component = control;
  if (matchedVariant) {
    const { codeRequest, variables } = matchedVariant;
    const { default: VariantWithoutVariables } = codeRequest;
    const Variant = forwardRef((props, ref) => (
      <VariantWithoutVariables {...{ ...variables, ...props, ref }} />
    ));
    Variant.displayName = `Variant(${
      VariantWithoutVariables.displayName ||
      VariantWithoutVariables.name ||
      "Component"
    })`;

    Component = withErrorBoundary({
      Variant,
      onVariantError,
      fallback: control
    });
  }
  return Component;
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
