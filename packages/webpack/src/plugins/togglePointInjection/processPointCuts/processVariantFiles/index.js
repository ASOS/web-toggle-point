import { posix } from "path";
import isJoinPointInvalid from "./isJoinPointInvalid";
const { dirname, relative } = posix;

const normalizeToRelativePath = (path, joinDirectory) =>
  relative(joinDirectory, path).replace(/^([^./])/, "./$1");

const processVariantFiles = async ({
  variantFiles,
  joinPointFiles,
  pointCut,
  warnings,
  ...rest
}) => {
  for (const { name, path } of variantFiles) {
    const joinPointPath = pointCut.joinPointResolver(path);
    const joinDirectory = dirname(joinPointPath);

    if (!joinPointFiles.has(joinPointPath)) {
      const isInvalid = await isJoinPointInvalid({
        name,
        joinPointPath,
        joinDirectory,
        ...rest
      });

      if (isInvalid) {
        continue;
      }
      joinPointFiles.set(joinPointPath, {
        pointCut,
        variants: new Map()
      });
    }

    const joinPointFile = joinPointFiles.get(joinPointPath);
    if (joinPointFile.pointCut !== pointCut) {
      warnings.push(
        `Join point "${joinPointPath}" is already assigned to point cut "${joinPointFile.pointCut.name}". Skipping assignment to "${pointCut.name}".`
      );
      continue;
    }

    const key = normalizeToRelativePath(path, joinDirectory);
    joinPointFile.variants.set(key, path);
  }
};

export default processVariantFiles;
