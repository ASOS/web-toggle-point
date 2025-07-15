import { posix } from "path";
import fastGlob from "fast-glob";
const { relative, join } = posix;

const getVariantPaths = async ({ variantGlobs, appRoot, fileSystem }) => {
  const variantPaths = new Set();
  for await (const glob of variantGlobs) {
    const results = await fastGlob.glob(join(appRoot, glob), {
      objectMode: true,
      fs: fileSystem
    });
    for (const { path } of results) {
      variantPaths.add(`/${relative(appRoot, path)}`);
    }
  }
  return variantPaths;
};

export default getVariantPaths;
