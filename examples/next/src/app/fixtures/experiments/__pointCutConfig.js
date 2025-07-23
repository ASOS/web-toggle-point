import toggledTwicePointCutConfig from "./8-toggled-twice/__variants__/test-feature/test-variant/__pointCutConfig.js";

export default [
  {
    name: "experiments",
    togglePointModuleSpecifier: "/src/app/fixtures/experiments/withTogglePoint",
    variantGlobs: [
      "./src/app/fixtures/experiments/**/__variants__/*/*/!(*.spec).tsx"
    ]
  },
  toggledTwicePointCutConfig
];
