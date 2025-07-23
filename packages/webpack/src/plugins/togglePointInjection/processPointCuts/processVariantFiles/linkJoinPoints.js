import { JOIN_POINTS, SCHEME } from "../../constants.js";

const linkJoinPoints = (joinPointFiles) => {
  for (const [, { variantPathMap }] of joinPointFiles) {
    for (const [key, path] of variantPathMap) {
      if (joinPointFiles.has(path)) {
        variantPathMap.set(key, `${SCHEME}:${JOIN_POINTS}:${path}`);
      }
    }
  }
};

export default linkJoinPoints;
