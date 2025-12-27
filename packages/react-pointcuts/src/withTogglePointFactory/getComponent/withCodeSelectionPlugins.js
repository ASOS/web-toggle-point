import { forwardRef } from "react";
import getDisplayName from "../getDisplayName";

const wrap = ({ Component, useHook, name }, rest) => {
  const WithTogglePointPlugin = forwardRef((props, ref) => {
    useHook(rest);

    return <Component {...props} ref={ref} />;
  });

  WithTogglePointPlugin.displayName = `With${name}(${getDisplayName(
    Component
  )})`;

  return WithTogglePointPlugin;
};

const withCodeSelectionPlugins = ({
  Component,
  codeSelectionPlugins,
  ...rest
}) => {
  for (const { onCodeSelected: useHook, name } of codeSelectionPlugins) {
    Component = wrap(
      {
        Component,
        useHook,
        name
      },
      rest
    );
  }

  return Component;
};

export default withCodeSelectionPlugins;
