import { posix } from "path";
import isJoinPointInvalid from "./isJoinPointInvalid";
const { parse, relative } = posix;

const processVariantFiles = async ({
  variantPaths,
  joinPointFiles,
  pointCut,
  joinPointResolver,
  warnings,
  ...rest
}) => {
  for (const variantPath of variantPaths) {
    const joinPointPath = joinPointResolver(variantPath);
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
        variants: []
      });
    }

    const joinPointFile = joinPointFiles.get(joinPointPath);
    if (joinPointFile.pointCut !== pointCut) {
      warnings.push(
        `Join point "${joinPointPath}" is already assigned to point cut "${joinPointFile.pointCut.name}". Skipping assignment to "${pointCut.name}".`
      );
      continue;
    }

    joinPointFile.variants.push(
      relative(directory, variantPath).replace(/^([^./])/, "./$1")
    );
  }
};

export default processVariantFiles;
