import { posix, sep } from "path";

const generatePointCut = ({ pointCuts, joinPointPath }) => {
  const pointCutName = joinPointPath.slice(1);
  const {
    togglePointModuleSpecifier,
    toggleHandlerFactoryModuleSpecifier,
    loadStrategy: { adapterModuleSpecifier }
  } = pointCuts.find(({ name }) => name === pointCutName);
  return `import togglePoint from "${togglePointModuleSpecifier}";
import handlerFactory from "${toggleHandlerFactoryModuleSpecifier}";
import * as namespace from "${adapterModuleSpecifier.replaceAll(sep, posix.sep)}";
const identity = (module) => module;
const { pack:_pack = identity, unpack:_unpack = identity } = namespace;
const handler = handlerFactory({ togglePoint, pack: _pack, unpack: _unpack });
export default handler;`;
};

export default generatePointCut;
