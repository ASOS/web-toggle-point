import processPointCuts from "./index.js";
import processVariantFiles from "./processVariantFiles/index.js";
import getVariantPaths from "./getVariantPaths.js";

jest.mock("./processVariantFiles/index.js", () => jest.fn());
jest.mock("./getVariantPaths.js", () =>
  jest.fn(() => Symbol("test-variant-paths"))
);

describe("processPointCuts", () => {
  const pointCuts = new Map([
    ["test-key-1", { ["test-key"]: Symbol("test-point-cut") }],
    ["test-key-2", { ["test-key"]: Symbol("test-point-cut") }],
    ["test-key-3", { ["test-key"]: Symbol("test-point-cut") }]
  ]);
  const pointCutsValues = Array.from(pointCuts.values());
  const appRoot = "test-app-root";
  const fileSystem = Symbol("test-file-system");
  let warnings, joinPointFiles;

  beforeEach(async () => {
    jest.clearAllMocks();

    ({ warnings, joinPointFiles } = await processPointCuts({
      appRoot,
      fileSystem,
      options: { pointCuts }
    }));
  });

  it("should get variant files for each of the point cuts", () => {
    for (const { variantGlobs } of pointCutsValues.keys()) {
      expect(getVariantPaths).toHaveBeenCalledWith({
        variantGlobs,
        appRoot,
        fileSystem
      });
    }
  });

  it("should process the variant files, and keep a shared record of config files found between each point cut", () => {
    for (const [index, pointCut] of pointCutsValues.entries()) {
      const variantPaths = getVariantPaths.mock.results[index].value;
      expect(processVariantFiles).toHaveBeenCalledWith({
        variantPaths,
        joinPointFiles,
        pointCut,
        warnings,
        configFiles: expect.any(Map),
        fileSystem,
        appRoot
      });
    }
    expect(
      new Set(
        processVariantFiles.mock.calls.map(([{ configFiles }]) => configFiles)
      ).size
    ).toEqual(1);
  });

  it("should return an array of warnings and a Map of join point files", () => {
    expect(warnings).toBeInstanceOf(Array);
    expect(joinPointFiles).toBeInstanceOf(Map);
  });
});
