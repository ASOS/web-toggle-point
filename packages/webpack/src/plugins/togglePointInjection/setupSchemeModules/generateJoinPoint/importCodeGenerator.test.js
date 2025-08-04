import importCodeGenerator from "./importCodeGenerator";

describe("importCodeGenerator", () => {
  const joinPointPath = "/test-folder/test-path";
  const relativePaths = [
    "/test-sub-folder/test-variant-1",
    "/test-sub-folder/test-variant-2",
    "/test-other-sub-folder/test-variant-1"
  ];
  const variantPathMap = new Map(
    relativePaths.map((relativePath) => [
      relativePath,
      `${joinPointPath}${relativePath}`
    ])
  );

  let result;

  beforeEach(() => {
    result = importCodeGenerator({
      joinPointPath,
      variantPathMap
    });
  });

  it("should return code that imports the base / control module for the join point", () => {
    expect(result).toMatch(`import * as joinPoint from "${joinPointPath}";`);
  });

  it("should return code that imports all the valid variants of the base / control module, storing in variables", () => {
    expect(result).toMatch(`
import * as variant_0 from "${joinPointPath}${relativePaths[0]}";
import * as variant_1 from "${joinPointPath}${relativePaths[1]}";
import * as variant_2 from "${joinPointPath}${relativePaths[2]}";`);
  });

  it("should return code that creates a Map of variants, keyed by relative path, valued as the variant module", () => {
    expect(result).toMatch(`const variantPathMap = new Map([
  ["/test-sub-folder/test-variant-1", variant_0],
  ["/test-sub-folder/test-variant-2", variant_1],
  ["/test-other-sub-folder/test-variant-1", variant_2]
]);`);
  });
});
