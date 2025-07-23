import { posix } from "path";
import isJoinPointInvalid from "./isJoinPointInvalid.js";
import linkJoinPoints from "./linkJoinPoints.js";
const { parse, relative } = posix;

const normalizeToRelativePath = (path, joinDirectory) =>
  relative(joinDirectory, path).replace(/^([^./])/, "./$1");

const processVariantFiles = async ({
  variantPaths,
  joinPointFiles,
  pointCut,
  warnings,
  ...rest
}) => {
  for (const variantPath of variantPaths) {
    const joinPointPath = pointCut.joinPointResolver(variantPath);
    const { dir: directory, base: filename } = parse(joinPointPath);

    if (!joinPointFiles.has(joinPointPath)) {
      const isInvalid = await isJoinPointInvalid({
        filename,
        joinPointPath,
        directory,
        ...rest
      });

      if (isInvalid) {
        continue;
      }
      joinPointFiles.set(joinPointPath, {
        pointCut,
        variantPathMap: new Map()
      });
    }

    const joinPointFile = joinPointFiles.get(joinPointPath);
    if (joinPointFile.pointCut !== pointCut) {
      warnings.push(
        `Join point "${joinPointPath}" is already assigned to point cut "${joinPointFile.pointCut.name}". Skipping assignment to "${pointCut.name}".`
      );
      continue;
    }

    const key = normalizeToRelativePath(variantPath, directory);
    joinPointFile.variantPathMap.set(key, variantPath);
  }

  linkJoinPoints(joinPointFiles);
};

export default processVariantFiles;
