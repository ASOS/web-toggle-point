import pathSegmentToggleHandler from "./pathSegmentToggleHandler.js";

const toggleOutcome = Symbol("test-outcome");
const togglePoint = jest.fn(() => toggleOutcome);
const joinPoint = Symbol("mock-join-point");

describe("pathSegmentToggleHandler", () => {
  let result;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  [1, 2, 3].forEach((segmentCount) => {
    const keyArray = [...Array(segmentCount).keys()];

    describe(`given a list of variant paths with ${segmentCount} path segments (after the variants path)`, () => {
      let variantPathMap;

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
        result = pathSegmentToggleHandler({
          togglePoint,
          joinPoint,
          variantPathMap
        });
      });

      it("should call the toggle point with the join point module and a map", () => {
        expect(togglePoint).toHaveBeenCalledWith(joinPoint, expect.any(Map));
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
            expect(node).toBe(variantPathMap[key]);
          }
        });
      });
    });
  });
});
