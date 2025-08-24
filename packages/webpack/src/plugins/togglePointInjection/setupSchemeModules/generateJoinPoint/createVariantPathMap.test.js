import createVariantPathMap from "./createVariantPathMap";

describe("createVariantPathMap", () => {
  it("should return code to create a variantPathMap constant, wrapping the supplied content in a Map", () => {
    const testContent = "test-content";
    expect(createVariantPathMap(testContent))
      .toEqual(`const variantPathMap = new Map([
${testContent}
]);`);
  });
});
