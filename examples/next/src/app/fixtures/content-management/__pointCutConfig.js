export default [
  {
    name: "content management",
    togglePointModuleSpecifier:
      "/src/app/fixtures/content-management/withToggledHook",
    variantGlobs: [
      "./src/app/fixtures/content-management/**/__variants__/*/*/use!(*.spec).ts"
    ]
  }
];
