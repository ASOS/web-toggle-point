"use client";

import { useEffect, useState } from "react";
import { withTogglePointFactory } from "@asos/web-toggle-point-react-pointcuts";
import { FEATURE_KEY, VARIANT_KEY } from "./constants";

const getActiveFeatures = () => {
  const [state, updateState] = useState<{
    [FEATURE_KEY]: { [VARIANT_KEY]: string; children: React.ReactNode };
  } | null>(null);
  const onKeyDown = (event) => {
    event.preventDefault();
    updateState({
      [FEATURE_KEY]: {
        [VARIANT_KEY]: event.key,
        children: <p>pressed: {event.key}</p>
      }
    });
  };
  const onKeyUp = (event) => {
    event.preventDefault();
    updateState(null);
  };
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyDown]);

  return state;
};

const withTogglePoint = withTogglePointFactory({
  getActiveFeatures,
  variantKey: VARIANT_KEY
});

export default withTogglePoint;
