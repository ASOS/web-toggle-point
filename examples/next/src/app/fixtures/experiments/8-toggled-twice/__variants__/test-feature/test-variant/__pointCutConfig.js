export default {
  name: "toggled twice experiment",
  togglePointModule: import.meta.resolve("./withTogglePoint.tsx"),
  variantGlobs: ["./src/app/fixtures/experiments/8-toggled-twice/**/*.?-?.tsx"],
  joinPointResolver: (path) => path.replace(/.-.\.tsx$/, "tsx"),
  toggleHandler: import.meta.resolve("./toggleHandlerFactory.ts")
};
