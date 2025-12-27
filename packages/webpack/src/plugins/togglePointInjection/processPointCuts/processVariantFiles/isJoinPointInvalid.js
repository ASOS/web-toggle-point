import { TOGGLE_CONFIG } from "../../constants";
import { promisify } from "util";
import { join } from "path";
import validateConfigSchema from "./validateConfigSchema";

const readFile = ({ fileSystem: { readFile }, path }) =>
  promisify(readFile)(path, "utf-8");

const fileExists = async (fileSystem, path) => {
  const stat = promisify(fileSystem.stat);
  try {
    return (await stat(path)).isFile();
  } catch {} // eslint-disable-line no-empty
  return false;
};

const ensureConfigFile = async ({
  configFiles,
  fileSystem,
  directory,
  appRoot
}) => {
  if (!configFiles.has(directory)) {
    let configFile = null;
    const path = `${join(appRoot, directory, TOGGLE_CONFIG)}`;
    if (await fileExists(fileSystem, path)) {
      configFile = JSON.parse(await readFile({ fileSystem, path }));
      validateConfigSchema({ configFile, appRoot, path });
    }
    configFiles.set(directory, configFile);
  }
};

const isJoinPointInvalid = async ({
  configFiles,
  filename,
  fileSystem,
  appRoot,
  joinPointPath,
  directory
}) => {
  await ensureConfigFile({ configFiles, fileSystem, directory, appRoot });

  if (configFiles.get(directory)?.joinPoints.includes(filename) === false) {
    return true;
  }

  if (!(await fileExists(fileSystem, join(appRoot, joinPointPath)))) {
    return true;
  }

  return false;
};

export default isJoinPointInvalid;
