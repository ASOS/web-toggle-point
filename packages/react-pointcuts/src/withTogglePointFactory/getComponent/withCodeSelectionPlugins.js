import { forwardRef } from "react";

const wrap = ({ Component, useHook, name }, rest) => {
  const WithTogglePointPlugin = forwardRef((props, ref) => {
    useHook(rest);

    return <Component {...props} ref={ref} />;
  });

  WithTogglePointPlugin.displayName = `With${name}(${
    Component.displayName || Component.name || "Component"
  })`;

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
