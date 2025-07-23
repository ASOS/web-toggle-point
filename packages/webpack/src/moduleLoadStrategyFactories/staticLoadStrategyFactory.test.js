/* eslint-disable import/namespace */
import staticLoadStrategyFactory, * as namespace from "./staticLoadStrategyFactory.js";

const path = "/test-folder/test-path";
const relativePaths = [
  "/test-sub-folder/test-variant-1",
  "/test-sub-folder/test-variant-2",
  "/test-other-sub-folder/test-variant-1"
];
const variantPathMap = new Map(
  relativePaths.map((relativePath) => [relativePath, `${path}${relativePath}`])
);

describe("staticLoadStrategyFactory", () => {
  let result;
  beforeEach(() => {
    result = staticLoadStrategyFactory();
  });

  it("should return an object containing the adapterModuleSpecifier, indicating the location of the factory code file (so that named exports for the pack and unpack functions can be included in the webpack compilation) and importCodeGenerator", () => {
    expect(result).toEqual(
      expect.objectContaining({
        adapterModuleSpecifier: expect.stringMatching(
          /packages([/\\])webpack\1src\1moduleLoadStrategyFactories\1staticLoadStrategyFactory\.js$/
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

    it("should return a script that imports the base / control module for the join point", () => {
      expect(importCode).toMatch(`import * as joinPoint from "${path}";`);
    });

    it("should return a script that imports all the valid variants of the base / control module, storing in variables", () => {
      expect(importCode).toMatch(`
import * as variant_0 from "${path}${relativePaths[0]}";
import * as variant_1 from "${path}${relativePaths[1]}";
import * as variant_2 from "${path}${relativePaths[2]}";`);
    });

    it("should return a script that creates a Map of variants, keyed by relative path, valued as the variant module", () => {
      expect(importCode).toMatch(`const variantPathMap = new Map([
  ["/test-sub-folder/test-variant-1", variant_0],
  ["/test-sub-folder/test-variant-2", variant_1],
  ["/test-other-sub-folder/test-variant-1", variant_2]
]);`);
    });
  });

  describe("pack", () => {
    it("should not export a pack function, so that the default (identity function) is used", () => {
      expect(namespace.pack).toBe(undefined);
    });
  });

  describe("unpack", () => {
    it("should not export an unpack function, so that the default (identity function) is used", () => {
      expect(namespace.unpack).toBe(undefined);
    });
  });
});
