import { fs as fileSystem, vol } from "memfs";
import { join, sep } from "path";
import getVariantPaths from "./getVariantPaths";

describe("getVariantPaths", () => {
  const appRoot = "/test-folder";
  let result;
  beforeEach(async () => {
    vol.fromJSON(
      {
        [join(
          sep,
          "test-folder",
          "test-matching-folder",
          "test-matching-file-1.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-non-matching-folder",
          "test-matching-file.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-matching-folder",
          "test-matching-file-2.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-matching-folder",
          "test-non-matching-file.js"
        )]: "",
        [join(
          sep,
          "test-folder",
          "test-non-matching-folder",
          "test-non-matching-file.js"
        )]: ""
      },
      sep
    );

    result = await getVariantPaths({
      variantGlobs: [
        "./**/test-matching-folder/**/test-matching-*.js",
        "./**/test-matching-folder/test-matching-*.js"
      ],
      appRoot,
      fileSystem
    });
  });

  it("should return the distinct matching file paths relative to the application root", () => {
    expect(Array.from(result)).toEqual([
      "/test-matching-folder/test-matching-file-1.js",
      "/test-matching-folder/test-matching-file-2.js"
    ]);
  });
});
