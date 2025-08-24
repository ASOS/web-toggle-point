import { POINT_CUTS, SCHEME } from "../../constants.js";
import generateJoinPoint from "./index.js";
import importCodeGenerator from "./importCodeGenerator.js";

jest.mock("../../constants", () => ({
  SCHEME: "test-scheme",
  POINT_CUTS: "test-point-cuts"
}));
const mockImportCode =
  "const joinPoint = 'test-join-point'; const variantPathMap = 'test-variants';";
jest.mock("./importCodeGenerator.js", () => jest.fn(() => mockImportCode));

describe("generateJoinPoint", () => {
  const joinPointPath = "/test-path";
  const pointCutName = "test-point-cut";
  const variantPathMap = Symbol("test-variant-path-map");
  const pointCut = {
    name: pointCutName
  };
  let result;

  beforeEach(() => {
    const joinPointFiles = new Map([
      [joinPointPath, { pointCut, variantPathMap }]
    ]);
    result = generateJoinPoint({
      joinPointFiles,
      joinPointPath
    });
  });

  it("should return a script that imports the appropriate point cut for the join point", () => {
    expect(result).toMatch(
      `import pointCut from "${SCHEME}:${POINT_CUTS}:/${pointCutName}";`
    );
  });

  it("should call the import code generator of the passed loading strategy, and return a script that includes the import code", () => {
    expect(importCodeGenerator).toHaveBeenCalledWith({
      joinPointPath,
      variantPathMap
    });
    expect(result).toMatch(mockImportCode);
  });

  it("should return a script that exports a default export which calls the point cut, passing the join point (control module) and the variantPathMap returned by the import code", () => {
    expect(result).toMatch(
      "export default pointCut({ joinPoint, variantPathMap });"
    );
  });
});
