import webpack from "webpack";
import fillDefaultOptionalValues from "./fillDefaultOptionalValues.js";

jest.mock("webpack", () => ({ NormalModule: Symbol("test-normal-module") }));

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

  const variantGlobs = Symbol("test-variant-globs");
  const joinPointResolver = Symbol("test-join-point-resolver");

  const defaultVariantGlobs = [
    "./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}"
  ];
  const defaultJoinPointResolver = expect.any(Function);
  const defaultToggleHandler =
    "@asos/web-toggle-point-webpack/pathSegmentToggleHandler";
  const toggleHandler = Symbol("test-toggle-handler");
  const webpackNormalModule = Symbol("test-webpack-normal-module");

  describe("when configuring the plugin with a supplied webpackNormalModule", () => {
    beforeEach(() => {
      result = fillDefaultOptionalValues({
        webpackNormalModule,
        pointCuts: []
      });
    });

    it("should return the supplied webpackNormalModule", () => {
      expect(result.webpackNormalModule).toBe(webpackNormalModule);
    });
  });

  describe("when configuring the plugin without supplying a webpackNormalModule", () => {
    beforeEach(() => {
      result = fillDefaultOptionalValues({
        pointCuts: []
      });
    });

    it("should return the NormalModule from the webpack import", () => {
      expect(result.webpackNormalModule).toBe(webpack.NormalModule);
    });
  });

  describe.each`
    variantGlobs    | joinPointResolver    | toggleHandler    | description                                                     | expectation
    ${undefined}    | ${undefined}         | ${undefined}     | ${"nothing"}                                                    | ${{ variantGlobs: defaultVariantGlobs, joinPointResolver: defaultJoinPointResolver, toggleHandler: defaultToggleHandler }}
    ${variantGlobs} | ${undefined}         | ${undefined}     | ${"a variantGlob, but nothing else"}                            | ${{ variantGlobs, joinPointResolver: defaultJoinPointResolver, toggleHandler: defaultToggleHandler }}
    ${variantGlobs} | ${joinPointResolver} | ${undefined}     | ${"a variantGlob and a join point resolver"}                    | ${{ variantGlobs, joinPointResolver, toggleHandler: defaultToggleHandler }}
    ${undefined}    | ${joinPointResolver} | ${undefined}     | ${"a joinPointResolver, but nothing else"}                      | ${{ variantGlobs: defaultVariantGlobs, joinPointResolver, toggleHandler: defaultToggleHandler }}
    ${undefined}    | ${undefined}         | ${toggleHandler} | ${"a toggle handler "}                                          | ${{ variantGlobs: defaultVariantGlobs, joinPointResolver: defaultJoinPointResolver, toggleHandler }}
    ${variantGlobs} | ${undefined}         | ${toggleHandler} | ${"a toggle handler and a variantGlob, but nothing else"}       | ${{ variantGlobs, joinPointResolver: defaultJoinPointResolver, toggleHandler }}
    ${variantGlobs} | ${joinPointResolver} | ${toggleHandler} | ${"a toggle handler, a variantGlob and a join point resolver"}  | ${{ variantGlobs, joinPointResolver, toggleHandler }}
    ${undefined}    | ${joinPointResolver} | ${toggleHandler} | ${"a toggle handler and a joinPointResolver, but nothing else"} | ${{ variantGlobs: defaultVariantGlobs, joinPointResolver, toggleHandler }}
  `(
    "when configuring pointCuts, supplying $description",
    // eslint-disable-next-line no-unused-vars
    ({ expectation, description, ...pointCut }) => {
      beforeEach(async () => {
        result = fillDefaultOptionalValues({ pointCuts: [pointCut] });
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
