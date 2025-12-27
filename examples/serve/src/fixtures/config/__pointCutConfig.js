import joinPointResolver from "../../joinPointResolver.js";

export default {
  name: "configuration",
  togglePointModuleSpecifier: "/src/fixtures/config/__togglePoint.js",
  variantGlobs: ["./src/fixtures/config/**/sites/*/*.js"],
  toggleHandlerFactoryModuleSpecifier: import.meta.resolve(
    "../../toggleHandlerFactories/listExtractionFromPathSegment.js"
  ),
  joinPointResolver
};
