import { posix, basename } from "path";

const fillPointCutDefaults = (pointCut) => {
  const {
    variantGlobs = ["./**/__variants__/*/*/!(*.test).{js,jsx,ts,tsx}"],
    joinPointResolver = (variantPath) =>
      posix.resolve(variantPath, ...Array(4).fill(".."), basename(variantPath))
  } = pointCut;

  return { variantGlobs, joinPointResolver };
};

export default fillPointCutDefaults;
