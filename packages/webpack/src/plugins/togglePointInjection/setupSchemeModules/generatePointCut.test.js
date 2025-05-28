import generatePointCut from "./generatePointCut.js";
import { posix, sep } from "path";

describe("generatePointCut", () => {
  const pointCutName = "test-point-cut";
  const joinPointPath = `/${pointCutName}`;
  const togglePointModuleSpecifier = "test-toggle-point-path";
  const toggleHandlerFactoryModuleSpecifier =
    "test-toggle-handler-factory-module-specifier";
  let adapterModuleSpecifier;
  let result, pointCuts;

  const makeCommonAssertions = () => {
    it("should return a script that imports the appropriate toggle point", () => {
      expect(result).toMatch(
        `import togglePoint from "${togglePointModuleSpecifier}";`
      );
    });

    it("should return a script that imports the appropriate toggle handler factory", () => {
      expect(result).toMatch(
        `import handlerFactory from "${toggleHandlerFactoryModuleSpecifier}";`
      );
    });

    it("should return a script that imports the pack and unpack exports of the appropriate adapter module, via the namespace, falling back to an identity function if the adapter does not export a pack/unpack handler", () => {
      // N.B. The pack and unpack functions must be aliased during the import to mitigate https://github.com/webpack/webpack/issues/19518
      expect(result).toMatch(
        `import * as namespace from "${adapterModuleSpecifier.replaceAll(sep, posix.sep)}";
const identity = (module) => module;
const { pack:_pack = identity, unpack:_unpack = identity } = namespace;`
      );
    });

    it("should return a script that constructs a toggle handler, passing the toggle point to the factory, plus the pack and unpack functions from the load strategy adapter", () => {
      expect(result).toMatch(
        "const handler = handlerFactory({ togglePoint, pack: _pack, unpack: _unpack });"
      );
    });

    it("should return a script with a handler default export", () => {
      expect(result).toMatch("export default handler;");
    });

    it("should return a script that imports the appropriate toggle handler", () => {
      expect(result).toMatch(
        `import handlerFactory from "${toggleHandlerFactoryModuleSpecifier}";`
      );
    });
  };

  describe("on posix based file systems", () => {
    beforeEach(() => {
      adapterModuleSpecifier = "/test/path/test-adapter-module-specifier";
      pointCuts = [
        { name: "test-other-point-cut", toggleHandlerFactoryModuleSpecifier },
        {
          name: pointCutName,
          togglePointModuleSpecifier,
          toggleHandlerFactoryModuleSpecifier,
          loadStrategy: {
            adapterModuleSpecifier
          }
        }
      ];
      result = generatePointCut({ pointCuts, joinPointPath });
    });

    makeCommonAssertions();
  });

  describe("on windows file systems", () => {
    beforeEach(() => {
      adapterModuleSpecifier = "D:\\test\\path\\test-adapter-module-specifier";
      pointCuts = [
        { name: "test-other-point-cut", toggleHandlerFactoryModuleSpecifier },
        {
          name: pointCutName,
          togglePointModuleSpecifier,
          toggleHandlerFactoryModuleSpecifier,
          loadStrategy: {
            adapterModuleSpecifier
          }
        }
      ];
      result = generatePointCut({ pointCuts, joinPointPath });
    });

    makeCommonAssertions();
  });
});
