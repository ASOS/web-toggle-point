import linkJoinPoints from "./linkJoinPoints";
import { JOIN_POINTS, SCHEME } from "../../constants.js";

jest.mock("../../constants.js", () => ({
  JOIN_POINTS: "mockedJoinPoints",
  SCHEME: "mockedScheme"
}));

describe("linkJoinPoints", () => {
  let mockJoinPoint1, mockJoinPoint2;
  beforeEach(() => {
    mockJoinPoint1 = [
      "path/to/joinPoint1",
      {
        variantPathMap: new Map([
          ["path/to/jointPoint1/variant1", "path/to/jointPoint1/variant1"],
          ["path/to/jointPoint1/variant2", "path/to/jointPoint1/variant2"]
        ])
      }
    ];
    mockJoinPoint2 = [
      "path/to/joinPoint2",
      {
        variantPathMap: new Map([
          ["path/to/jointPoint2/variant1", "path/to/jointPoint2/variant1"],
          ["path/to/jointPoint2/variant2", "path/to/jointPoint2/variant2"]
        ])
      }
    ];
  });

  describe("when join points are not chained", () => {
    it("should not modify the join point files", () => {
      const joinPointFiles = new Map([mockJoinPoint1, mockJoinPoint2]);
      linkJoinPoints(joinPointFiles);

      expect(joinPointFiles).toEqual(
        new Map([
          [
            "path/to/joinPoint1",
            {
              variantPathMap: new Map([
                [
                  "path/to/jointPoint1/variant1",
                  "path/to/jointPoint1/variant1"
                ],
                ["path/to/jointPoint1/variant2", "path/to/jointPoint1/variant2"]
              ])
            }
          ],
          [
            "path/to/joinPoint2",
            {
              variantPathMap: new Map([
                [
                  "path/to/jointPoint2/variant1",
                  "path/to/jointPoint2/variant1"
                ],
                ["path/to/jointPoint2/variant2", "path/to/jointPoint2/variant2"]
              ])
            }
          ]
        ])
      );
    });
  });

  describe("when a variant of a join point is itself a join point", () => {
    it("should link variants of the join point to the connected join point", () => {
      const connectedJoinPoint2 = [
        "path/to/jointPoint1/variant1",
        mockJoinPoint2[1]
      ];

      const joinPointFiles = new Map([mockJoinPoint1, connectedJoinPoint2]);

      linkJoinPoints(joinPointFiles);

      expect(joinPointFiles).toEqual(
        new Map([
          [
            "path/to/joinPoint1",
            {
              variantPathMap: new Map([
                [
                  "path/to/jointPoint1/variant1",
                  `${SCHEME}:${JOIN_POINTS}:path/to/jointPoint1/variant1`
                ],
                ["path/to/jointPoint1/variant2", "path/to/jointPoint1/variant2"]
              ])
            }
          ],
          [
            "path/to/jointPoint1/variant1",
            {
              variantPathMap: new Map([
                [
                  "path/to/jointPoint2/variant1",
                  "path/to/jointPoint2/variant1"
                ],
                ["path/to/jointPoint2/variant2", "path/to/jointPoint2/variant2"]
              ])
            }
          ]
        ])
      );
    });
  });
});
