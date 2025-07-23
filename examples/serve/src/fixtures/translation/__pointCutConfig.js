import joinPointResolver from "../../joinPointResolver.js";
// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import loadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/staticLoadStrategyFactory";

export default {
  name: "translation",
  togglePointModuleSpecifier: "/src/fixtures/translation/__togglePoint.js",
  variantGlobs: ["./src/fixtures/translation/languages/*/*.json"],
  joinPointResolver,
  loadStrategy: loadStrategyFactory()
};
