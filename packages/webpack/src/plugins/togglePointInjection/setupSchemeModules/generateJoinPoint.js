import { POINT_CUTS, SCHEME } from "../constants.js";

const generateJoinPoint = ({ joinPointFiles, joinPointPath }) => {
  const {
    pointCut: {
      name,
      loadStrategy: { importCodeGenerator }
    },
    variantPathMap
  } = joinPointFiles.get(joinPointPath);
  const pointCutImport = `import pointCut from "${SCHEME}:${POINT_CUTS}:/${name}";`;

  const code = importCodeGenerator({ joinPointPath, variantPathMap });

  return `${pointCutImport}
${code}
export default pointCut({ joinPoint, variantPathMap });`;
};

export default generateJoinPoint;
