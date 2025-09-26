import resourceProxyExistsInRequestChain from "./resourceProxyExistsInRequestChain";
import { createMockGraph } from "../../../../../test/test-utils";

const proxyResource = Symbol("test-proxy-resource");

describe("resourceProxyExistsInRequestChain", () => {
  let result;

  describe("when the issuer module is the proxy resource", () => {
    const moduleGraph = { getIncomingConnections: jest.fn() };

    beforeEach(() => {
      result = resourceProxyExistsInRequestChain({
        moduleGraph,
        issuerModule: {
          resource: proxyResource
        },
        proxyResource
      });
    });

    it("should not attempt to get incoming connections of issuer module", () => {
      expect(moduleGraph.getIncomingConnections).not.toHaveBeenCalled();
    });

    it("should return true", () => {
      expect(result).toBe(true);
    });
  });

  describe("when the issuer module is not the proxy resource", () => {
    const depth = 3;
    const siblingsAtEachDepthCount = 3;
    let moduleGraph, issuerModule;

    beforeEach(() => {
      const { rootNode, getIncomingConnections } = createMockGraph({
        depth,
        siblingsAtEachDepthCount
      });
      moduleGraph = { getIncomingConnections };
      issuerModule = rootNode;
    });

    describe("and one of the modules that directly imported the issuer module is the proxy resource", () => {
      beforeEach(() => {
        const { value: parent } = moduleGraph
          .getIncomingConnections(issuerModule)
          .next();
        parent.originModule.resource = proxyResource;
        moduleGraph.getIncomingConnections.mockClear();

        result = resourceProxyExistsInRequestChain({
          moduleGraph,
          issuerModule,
          proxyResource
        });
      });

      it("should get the incoming connections of issuer module", () => {
        expect(moduleGraph.getIncomingConnections).toHaveBeenCalledWith(
          issuerModule
        );
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });

    describe("and one of the modules that directly imported the issuer module is the not proxy resource", () => {
      describe("and one of the modules that imported the issuer module was imported by the proxy resource", () => {
        let parentIssuerModules;

        const getNextOriginModule = (connections) =>
          connections.next().value.originModule;

        beforeEach(() => {
          const connections = moduleGraph.getIncomingConnections(issuerModule);
          const firstIssuerModule = getNextOriginModule(connections);
          const secondIssuerModule = getNextOriginModule(connections);
          parentIssuerModules = [firstIssuerModule, secondIssuerModule];

          const grandParentModule = getNextOriginModule(
            moduleGraph.getIncomingConnections(secondIssuerModule)
          );
          grandParentModule.resource = proxyResource;
          moduleGraph.getIncomingConnections.mockClear();

          result = resourceProxyExistsInRequestChain({
            moduleGraph,
            issuerModule,
            proxyResource
          });
        });

        it("should get the incoming connections of issuer module", () => {
          expect(moduleGraph.getIncomingConnections).toHaveBeenNthCalledWith(
            1,
            issuerModule
          );
        });

        it("should get the incoming connections of the modules that directly imported the issuer module, that were not the proxy, using a breadth-first search (hence assuming colocation)", () => {
          for (const [
            index,
            parentIssuerModule
          ] of parentIssuerModules.entries()) {
            expect(moduleGraph.getIncomingConnections).toHaveBeenNthCalledWith(
              index + 2,
              parentIssuerModule
            );
          }
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });

      describe("and one of the modules that imported the issuer module was not imported by the proxy resource", () => {
        describe("and there is a circular dependency", () => {
          beforeEach(() => {
            let count = 0;
            const newModuleGraph = {
              ...moduleGraph,
              getIncomingConnections: jest.fn().mockImplementation((module) => {
                if (count++ === 10) {
                  count = 0;
                  return moduleGraph.getIncomingConnections(issuerModule);
                }
                return moduleGraph.getIncomingConnections(module);
              })
            };
            result = resourceProxyExistsInRequestChain({
              moduleGraph: newModuleGraph,
              issuerModule,
              proxyResource
            });
          });

          it("should return false, without locking up / running forever", () => {
            expect(result).toBe(false);
          });
        });

        describe("and there is no circular dependency", () => {
          beforeEach(() => {
            result = resourceProxyExistsInRequestChain({
              moduleGraph,
              issuerModule,
              proxyResource
            });
          });

          it("should have traversed the whole import tree of the issuer module", () => {
            let expectedCount = 1;
            for (let level = 1; level <= depth; level++) {
              expectedCount += Math.pow(siblingsAtEachDepthCount, level);
            }

            expect(
              moduleGraph.getIncomingConnections.mock.calls.length
            ).toEqual(expectedCount);
          });

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });
      });
    });
  });
});
