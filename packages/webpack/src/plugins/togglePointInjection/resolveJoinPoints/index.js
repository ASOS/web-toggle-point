import { PLUGIN_NAME } from "../constants";
import { posix, sep } from "path";
import { promisify } from "util";
import handleJoinPointMatch from "./handleJoinPointMatch";
const { relative } = posix;

const isLoaderlessFileRequest = (request) =>
  [".", "/"].includes(request.at(0)) && !request.includes("!");

const resolveJoinPoints = ({
  compilation,
  appRoot,
  normalModuleFactory,
  joinPointFiles
}) => {
  const resolver = compilation.resolverFactory.get("normal", {
    dependencyType: "esm"
  });
  const enhancedResolve = promisify(resolver.resolve.bind(resolver));

  normalModuleFactory.hooks.beforeResolve.tapPromise(
    PLUGIN_NAME,
    async (resolveData) => {
      if (
        !joinPointFiles.size ||
        !resolveData.context.replaceAll(sep, posix.sep).startsWith(appRoot) ||
        !isLoaderlessFileRequest(resolveData.request)
      ) {
        return;
      }

      const resolved = await enhancedResolve(
        {},
        resolveData.context,
        resolveData.request,
        {}
      );

      const resource = `/${relative(appRoot, resolved.replaceAll(sep, posix.sep))}`;
      if (joinPointFiles.has(resource)) {
        handleJoinPointMatch({
          resource,
          compilation,
          resolveData
        });
      }
    }
  );
};

export default resolveJoinPoints;
