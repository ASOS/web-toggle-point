export default {
  name: "event",
  togglePointModuleSpecifier: "/src/fixtures/event/__togglePoint.js",
  variantGlobs: ["./src/fixtures/event/**/*.*.css"],
  toggleHandlerFactoryModuleSpecifier: import.meta.resolve(
    "../../toggleHandlerFactories/singleFilenameDottedSegment.js"
  ),
  joinPointResolver: (path) => path.replace(/\.([^.]+)\.css$/, ".css")
};
