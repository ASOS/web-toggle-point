import { forwardRef } from "react";
import getDisplayName from "../getDisplayName";

const wrap = ({ component: Component, useHook, name }, rest) => {
  const WithTogglePointPlugin = forwardRef((props, ref) => {
    useHook(rest);

    return <Component {...props} ref={ref} />;
  });

  WithTogglePointPlugin.displayName = `With${name}(${getDisplayName(
    Component
  )})`;

  return WithTogglePointPlugin;
};

const withPlugins = ({ component, plugins, ...rest }) => {
  for (const { onCodeSelected: useHook, name } of plugins) {
    component = wrap(
      {
        component,
        useHook,
        name
      },
      rest
    );
  }

  return component;
};

export default withPlugins;
