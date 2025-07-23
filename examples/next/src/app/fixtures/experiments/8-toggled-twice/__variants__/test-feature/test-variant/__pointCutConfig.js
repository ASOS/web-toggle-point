import lazyComponentLoadStrategyFactory from "@asos/web-toggle-point-react-pointcuts/lazyComponentLoadStrategyFactory";

export default {
  name: "toggled twice experiment",
  togglePointModuleSpecifier: import.meta.resolve("./withTogglePoint.tsx"),
  variantGlobs: ["./src/app/fixtures/experiments/8-toggled-twice/**/*.?-?.tsx"],
  joinPointResolver: (path) => path.replace(/.-.\.tsx$/, "tsx"),
  toggleHandlerFactoryModuleSpecifier: import.meta.resolve(
    "./toggleHandlerFactory.ts"
  ),
  loadStrategy: lazyComponentLoadStrategyFactory({
    importCodeGeneratorOptions: {
      webpackMagicComment:
        "/* webpackChunkName: 'toggled-twice-chunk', webpackPreload: true */"
    }
  })
};
