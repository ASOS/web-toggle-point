import { posix } from "path";
import isJoinPointInvalid from "./isJoinPointInvalid.js";
import linkJoinPoints from "./linkJoinPoints.js";
import processVariantFiles from "./index.js";

const { resolve, join, sep } = posix;

jest.mock("./linkJoinPoints.js", () => jest.fn());
jest.mock("./isJoinPointInvalid.js", () => jest.fn());

describe("processVariantFiles", () => {
  let joinPointFiles;
  const pointCut = { name: "test-point-cut", joinPointResolver: jest.fn() };
  let warnings;

  const variantFileGlob = "test-variant-*.*";
  const moduleFile = "test-module.js";
  const joinPointFolder = "test-folder";
  const joinPointPath = join(joinPointFolder, moduleFile);
  const rest = { [Symbol("test-key")]: Symbol("test-value") };

  beforeEach(async () => {
    jest.clearAllMocks();
    warnings = [];
    joinPointFiles = new Map();
  });

  const act = async ({ variantPaths }) => {
    await processVariantFiles({
      variantPaths,
      joinPointFiles,
      pointCut,
      warnings,
      ...rest
    });
  };

  describe("when given no variant files", () => {
    beforeEach(async () => {
      await act({ variantPaths: new Set(), configFiles: new Map() });
    });

    it("should add no warnings, and not modify joinPointFiles", async () => {
      expect(warnings).toEqual([]);
      expect(joinPointFiles).toEqual(new Map());
    });
  });

  const variantPath = variantFileGlob.replaceAll("*", "1");

  describe.each`
    variantPath                 | expectedVariant
    ${variantPath}              | ${"." + sep + variantPath}
    ${"." + variantPath}        | ${"." + variantPath}
    ${"." + sep + variantPath}  | ${"." + sep + variantPath}
    ${".." + sep + variantPath} | ${".." + sep + variantPath}
  `(
    "when given a variant path ($variantPath)",
    ({ variantPath, expectedVariant }) => {
      const path = resolve(joinPointFolder, variantPath);
      const variantPaths = new Set([resolve(joinPointFolder, variantPath)]);

      const makeCommonAssertions = () => {
        it("should call the joinPointResolver with the path to the variant file", () => {
          expect(pointCut.joinPointResolver).toHaveBeenCalledWith(path);
        });

        it("should call linkJoinPoints with the updated joinPointFiles", () => {
          expect(linkJoinPoints).toHaveBeenCalledWith(joinPointFiles);
        });
      };

      describe("when given a variant file that is not valid according to the configured config files", () => {
        const filename = "test-not-matching-control";
        const joinPointPath = join(joinPointFolder, filename);

        beforeEach(async () => {
          pointCut.joinPointResolver.mockReturnValue(joinPointPath);
          isJoinPointInvalid.mockReturnValue(true);
          await act({
            variantPaths,
            configFiles: new Map()
          });
        });

        makeCommonAssertions();

        it("should call isJoinPointInvalid with the expected arguments", () => {
          expect(isJoinPointInvalid).toHaveBeenCalledWith({
            filename,
            joinPointPath,
            directory: joinPointFolder,
            ...rest
          });
        });

        it("should add no warnings, and not modify joinPointFiles", async () => {
          expect(warnings).toEqual([]);
          expect(joinPointFiles).toEqual(new Map());
        });
      });

      describe("when given a variant file that has a matching join point file", () => {
        beforeEach(async () => {
          pointCut.joinPointResolver.mockReturnValue(joinPointPath);
        });

        describe("and no config file precludes it being valid", () => {
          beforeEach(async () => {
            isJoinPointInvalid.mockReturnValue(false);
            await act({ variantPaths });
          });

          makeCommonAssertions();

          it("should call isJoinPointInvalid with the expected arguments", () => {
            expect(isJoinPointInvalid).toHaveBeenCalledWith({
              filename: moduleFile,
              joinPointPath,
              directory: joinPointFolder,
              ...rest
            });
          });

          it("should add no warnings, and add a single joinPointFile representing the matched join point, relative to the control module", async () => {
            expect(warnings).toEqual([]);
            expect(joinPointFiles).toEqual(
              new Map([
                [
                  joinPointPath,
                  {
                    pointCut,
                    variantPathMap: new Map([[expectedVariant, path]])
                  }
                ]
              ])
            );
          });
        });

        describe("and a preceding point cut already identified the join point", () => {
          const testOtherPointCut = { name: "test-other-point-cut" };
          beforeEach(async () => {
            joinPointFiles.set(joinPointPath, {
              pointCut: testOtherPointCut
            });
            await act({
              variantPaths
            });
          });

          makeCommonAssertions();

          it("should not check if the join point is invalid again", () => {
            expect(isJoinPointInvalid).not.toHaveBeenCalled();
          });

          it("should add a warning, and not modify joinPointFiles", async () => {
            expect(warnings).toEqual([
              `Join point "${joinPointPath}" is already assigned to point cut "${testOtherPointCut.name}". Skipping assignment to "${pointCut.name}".`
            ]);
            expect(joinPointFiles).toEqual(
              new Map([
                [
                  joinPointPath,
                  {
                    pointCut: testOtherPointCut
                  }
                ]
              ])
            );
          });
        });
      });
    }
  );
});
