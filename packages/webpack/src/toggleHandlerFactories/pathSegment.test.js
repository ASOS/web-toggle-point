import pathSegmentToggleHandlerFactory from "./pathSegment.js";

const toggleOutcome = Symbol("test-outcome");
const togglePoint = jest.fn(() => toggleOutcome);
const pack = jest.fn(() => Symbol("packed"));
const unpack = jest.fn(() => Symbol("unpacked"));

describe("toggleHandlerFactories/pathSegment", () => {
  let toggleHandlerFactory;

  beforeEach(() => {
    jest.clearAllMocks();
    toggleHandlerFactory = pathSegmentToggleHandlerFactory({
      togglePoint,
      pack,
      unpack
    });
  });

  [1, 2, 3].forEach((segmentCount) => {
    const keyArray = [...Array(segmentCount).keys()];

    describe(`given a Map keyed by variant paths with ${segmentCount} path segments (after the variants path)`, () => {
      let result, variantPathMap;
      const joinPoint = Symbol("mock-join-point");

      beforeEach(() => {
        const segments = keyArray.map((key) => `test-segment-${key}/`);
        variantPathMap = new Map([
          [
            `./__variants__/${segments.join("")}test-variant.js`,
            Symbol("test-variant")
          ],
          [
            `./__variants__/${segments.reverse().join("")}test-variant.js`,
            Symbol("test-variant")
          ]
        ]);
        result = toggleHandlerFactory({
          joinPoint,
          variantPathMap
        });
      });

      it("should pack the join point", () => {
        expect(pack).toHaveBeenCalledWith(joinPoint);
      });

      it("should call the toggle point with the join point module and a map, plus the passed method to unpack modules", () => {
        const packedJoinPoint = pack.mock.results.pop().value;
        expect(togglePoint).toHaveBeenCalledWith({
          joinPoint: packedJoinPoint,
          featuresMap: expect.any(Map),
          unpack
        });
      });

      it("should return the outcome of the toggle point", () => {
        expect(result).toBe(toggleOutcome);
      });

      describe("when the toggle point interrogates the map", () => {
        let map;

        beforeEach(() => {
          [, map] = togglePoint.mock.lastCall;
        });

        it("should return a map containing maps for each segment, concluding with the variant at the leaf node", () => {
          for (const key of Object.keys(variantPathMap)) {
            const segments = key.split("/").slice(0, -1);
            let node = map;
            for (const segment of segments.slice(2)) {
              expect(node.has(segment)).toBe(true);
              node = node.get(segment);
            }
            expect(pack).toHaveBeenCalledWith(variantPathMap.get(key));
            expect(node).toBe(pack.mock.results.pop().value);
          }
        });
      });
    });
  });
});
