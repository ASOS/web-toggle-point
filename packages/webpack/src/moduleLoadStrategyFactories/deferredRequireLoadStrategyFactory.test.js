/* eslint-disable import/namespace */
import deferredRequireLoadStrategyFactory, * as namespace from "./deferredRequireLoadStrategyFactory.js";

const path = "/test-folder/test-path";
const relativePaths = [
  "/test-sub-folder/test-variant-1",
  "/test-sub-folder/test-variant-2",
  "/test-other-sub-folder/test-variant-1"
];
const variantPathMap = new Map(
  relativePaths.map((relativePath) => [relativePath, `${path}${relativePath}`])
);

describe("deferredRequireLoadStrategyFactory", () => {
  let result;

  beforeEach(() => {
    result = deferredRequireLoadStrategyFactory();
  });

  it("should return an object containing the adapterModuleSpecifier, indicating the location of the factory code file (so that named exports for the pack and unpack functions can be included in the webpack compilation) and importCodeGenerator", () => {
    expect(result).toEqual(
      expect.objectContaining({
        adapterModuleSpecifier: expect.stringMatching(
          /packages([/\\])webpack\1src\1moduleLoadStrategyFactories\1deferredRequireLoadStrategyFactory\.js$/
        ),
        importCodeGenerator: expect.any(Function)
      })
    );
  });

  describe("when the importCodeGenerator is called", () => {
    let importCode;

    beforeEach(() => {
      importCode = result.importCodeGenerator({
        joinPointPath: path,
        variantPathMap
      });
    });

    it("should return a script that prepares a join point function that will require the join point, when executed", () => {
      expect(importCode).toMatch(`const joinPoint = () => require("${path}");`);
    });

    it("should return a script that creates a Map of variants, keyed by relative path, valued as a function that will require the variant module when executed", () => {
      expect(importCode).toMatch(`const variantPathMap = new Map([
  ["/test-sub-folder/test-variant-1", () => require("${path}${relativePaths[0]}")],
  ["/test-sub-folder/test-variant-2", () => require("${path}${relativePaths[1]}")],
  ["/test-other-sub-folder/test-variant-1", () => require("${path}${relativePaths[2]}")]
]);`);
    });
  });

  describe("pack", () => {
    it("should not export a pack function, so that the default (identity function) is used", () => {
      expect(namespace.pack).toBe(undefined);
    });
  });

  describe("unpack", () => {
    it("should call the expression passed to it as a function, and return the result", () => {
      const expected = Symbol("test");
      const expression = () => expected;
      expect(namespace.unpack(expression)).toBe(expected);
    });
  });
});
