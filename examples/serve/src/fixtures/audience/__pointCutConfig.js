import { basename, posix } from "path";
// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import loadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/deferredDynamicImportLoadStrategyFactory";

export default {
  name: "audience",
  togglePointModuleSpecifier: "/src/fixtures/audience/__togglePoint.js",
  variantGlobs: ["./src/fixtures/audience/**/cohort-[1-9]*([0-9])/*.js"],
  toggleHandlerFactoryModuleSpecifier: import.meta.resolve(
    "../../toggleHandlerFactories/singlePathSegment.js"
  ),
  joinPointResolver: (path) =>
    posix.resolve(path, "../..", basename(path).replace("bespoke", "control")),
  loadStrategy: loadStrategyFactory()
};
