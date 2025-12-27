import deferredRequireLoadStrategyFactory from "../../moduleLoadStrategyFactories/deferredRequireLoadStrategyFactory.js";

const mockDeferredRequireLoadStrategy = Symbol("test-default-load-strategy");
jest.mock(
  "../../moduleLoadStrategyFactories/deferredRequireLoadStrategyFactory.js",
  () => jest.fn(() => mockDeferredRequireLoadStrategy)
);

describe("fillDefaultOptionalValues", () => {
  let result;

  const makeDefaultJoinPointResolverAssertions = () => {
    describe("when the joinPointResolver is called", () => {
      it("should return a path that is the same as the variantPath, but with the last 3 directories removed", () => {
        const variantPath =
          "/test-folder/test-sub-folder/test-sub-folder/test-sub-folder/test-variant";
        const joinPointPath = result.joinPointResolver(variantPath);
        expect(joinPointPath).toEqual("/test-folder/test-variant");
      });
    });
  };

  const variantGlob = Symbol("test-variant-glob");
  const joinPointResolver = Symbol("test-join-point-resolver");
  const loadStrategy = Symbol("test-load-strategy");

  const defaultVariantGlob = "./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}";
  const defaultJoinPointResolver = expect.any(Function);
  const defaultToggleHandlerFactoryModuleSpecifier =
    "@asos/web-toggle-point-webpack/toggleHandlerFactories/pathSegment";
  const toggleHandlerFactoryModuleSpecifier = Symbol(
    "test-toggle-handler-factory-module-specifier"
  );

  describe.each`
    variantGlob    | joinPointResolver    | loadStrategy    | toggleHandlerFactoryModuleSpecifier    | description                                                                                            | expectation
    ${undefined}   | ${undefined}         | ${undefined}    | ${undefined}                           | ${"nothing"}                                                                                           | ${{ variantGlob: defaultVariantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${undefined}         | ${undefined}    | ${undefined}                           | ${"a variantGlob, but nothing else"}                                                                   | ${{ variantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${joinPointResolver} | ${undefined}    | ${undefined}                           | ${"a variantGlob and a join point resolver"}                                                           | ${{ variantGlob, joinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${undefined}         | ${loadStrategy} | ${undefined}                           | ${"a variantGlob and a load strategy"}                                                                 | ${{ variantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${joinPointResolver} | ${loadStrategy} | ${undefined}                           | ${"a variantGlob, a join point resolver and a load strategy"}                                          | ${{ variantGlob, joinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${joinPointResolver} | ${undefined}    | ${undefined}                           | ${"a joinPointResolver, but nothing else"}                                                             | ${{ variantGlob: defaultVariantGlob, joinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${joinPointResolver} | ${loadStrategy} | ${undefined}                           | ${"a joinPointResolver and a load strategy"}                                                           | ${{ variantGlob: defaultVariantGlob, joinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${undefined}         | ${loadStrategy} | ${undefined}                           | ${"a load strategy, but nothing else"}                                                                 | ${{ variantGlob: defaultVariantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: defaultToggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${undefined}         | ${undefined}    | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier"}                                                         | ${{ variantGlob: defaultVariantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${undefined}         | ${undefined}    | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier and a variantGlob, but nothing else"}                     | ${{ variantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${joinPointResolver} | ${undefined}    | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier, a variantGlob and a join point resolver"}                | ${{ variantGlob, joinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${undefined}         | ${loadStrategy} | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier, variantGlob and a load strategy"}                        | ${{ variantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${variantGlob} | ${joinPointResolver} | ${loadStrategy} | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier, variantGlob, a join point resolver and a load strategy"} | ${{ variantGlob, joinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${joinPointResolver} | ${undefined}    | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier and a joinPointResolver, but nothing else"}               | ${{ variantGlob: defaultVariantGlob, joinPointResolver, loadStrategy: mockDeferredRequireLoadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${joinPointResolver} | ${loadStrategy} | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier, joinPointResolver and a load strategy"}                  | ${{ variantGlob: defaultVariantGlob, joinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
    ${undefined}   | ${undefined}         | ${loadStrategy} | ${toggleHandlerFactoryModuleSpecifier} | ${"a toggle handler factory module specifier and a load strategy, but nothing else"}                   | ${{ variantGlob: defaultVariantGlob, joinPointResolver: defaultJoinPointResolver, loadStrategy, toggleHandlerFactoryModuleSpecifier: toggleHandlerFactoryModuleSpecifier }}
  `(
    "when configuring pointCuts, supplying $description",
    // eslint-disable-next-line no-unused-vars
    ({ expectation, description, ...pointCut }) => {
      beforeEach(async () => {
        const { default: fillDefaultOptionalValues } = await import(
          "./fillDefaultOptionalValues.js"
        );
        result = fillDefaultOptionalValues({ pointCuts: [pointCut] });
      });

      it("should have retrieved the default load strategy", () => {
        expect(deferredRequireLoadStrategyFactory).toHaveBeenCalled();
      });

      it("should fill the defaults", () => {
        expect(result.pointCuts[0]).toEqual(expectation);
      });

      if (!joinPointResolver) {
        makeDefaultJoinPointResolverAssertions();
      }
    }
  );
});
