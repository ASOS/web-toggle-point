/* eslint-disable import/namespace */
import lazyComponentLoadStrategyFactory, * as namespace from "./lazyComponentLoadStrategyFactory.js";
// eslint-disable-next-line import/no-unresolved -- https://github.com/import-js/eslint-plugin-import/issues/1810
import deferredDynamicImportLoadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/deferredDynamicImportLoadStrategyFactory";
import { lazy } from "react";

const mockLazyResult = Symbol("test-lazy-result");
jest.mock("react", () => ({
  lazy: jest.fn(() => mockLazyResult)
}));

const mockImportCodeGenerator = Symbol("test-import-code-generator");
jest.mock(
  "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/deferredDynamicImportLoadStrategyFactory",
  () =>
    jest.fn(() => ({
      importCodeGenerator: mockImportCodeGenerator
    }))
);

describe("lazyComponentLoadStrategyFactory", () => {
  const options = Symbol("test-options");
  let result;

  beforeEach(() => {
    result = lazyComponentLoadStrategyFactory(options);
  });

  it("should call the deferredDynamicImportLoadStrategyFactory with the options passed to it", () => {
    expect(deferredDynamicImportLoadStrategyFactory).toHaveBeenCalledWith(
      options
    );
  });

  it("should return an object containing the adapterModuleSpecifier, indicating the location of the factory code file (so that named exports for the pack and unpack functions can be included in the webpack compilation) and importCodeGenerator", () => {
    expect(result).toEqual(
      expect.objectContaining({
        adapterModuleSpecifier: expect.stringMatching(
          /packages([/\\])react-pointcuts\1src\1lazyComponentLoadStrategyFactory\.js$/
        )
      })
    );
  });

  it("should return the importCodeGenerator from the deferredDynamicImportLoadStrategyFactory", () => {
    expect(result).toEqual(
      expect.objectContaining({
        importCodeGenerator: mockImportCodeGenerator
      })
    );
  });

  it("should export a pack function that wraps its input in React.lazy", () => {
    const expression = Symbol("test-expression");
    const packResult = namespace.pack(expression);
    expect(lazy).toHaveBeenCalledWith(expression);
    expect(packResult).toBe(mockLazyResult);
  });

  describe("unpack", () => {
    it("should not export an unpack function, so that the default (identity function) is used", () => {
      expect(namespace.unpack).toBe(undefined);
    });
  });
});
