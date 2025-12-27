import { win32, posix } from "path";
import loadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/staticLoadStrategyFactory";

const toggleHandlerFactoryModuleSpecifier =
  "/src/routes/parallel-folder-convention/toggle-plumbing/toggleHandler";
const joinPointResolver = (path) =>
  path.replaceAll(win32.sep, posix.sep).replace(/__variants__\/[^/]+\//, "");

const common = {
  toggleHandlerFactoryModuleSpecifier,
  joinPointResolver,
  loadStrategy: loadStrategyFactory()
};

export default [
  {
    name: "react components",
    togglePointModuleSpecifier:
      "/src/routes/parallel-folder-convention/toggle-plumbing/toggle-points/reactComponentTogglePoint",
    variantGlobs: [
      "./src/routes/parallel-folder-convention/__variants__/*/components/**/!(*.spec).tsx"
    ],
    ...common
  },
  {
    name: "css modules & constants & redux slices",
    togglePointModuleSpecifier:
      "/src/routes/parallel-folder-convention/toggle-plumbing/toggle-points/objectProxyTogglePoint",
    variantGlobs: [
      "./src/routes/parallel-folder-convention/__variants__/*/components/**/*.css",
      "./src/routes/parallel-folder-convention/__variants__/*/constants/**/*.ts",
      "./src/routes/parallel-folder-convention/__variants__/*/state/modules/*/slice.ts"
    ],
    ...common
  },
  {
    name: "redux reducer maps",
    togglePointModuleSpecifier:
      "/src/routes/parallel-folder-convention/toggle-plumbing/toggle-points/reduxReducerMapTogglePoint",
    variantGlobs: [
      "./src/routes/parallel-folder-convention/__variants__/*/state/modules/index.ts"
    ],
    ...common
  }
];
