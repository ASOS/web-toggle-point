import getDisplayName from "./getDisplayName";

describe("getDisplayName", () => {
  let result;

  describe("when the given component has a displayName", () => {
    const mockComponent = () => {};
    mockComponent.displayName = "test-component";

    beforeEach(() => {
      result = getDisplayName(mockComponent);
    });

    it("should return the component's display name", () => {
      expect(result).toBe(mockComponent.displayName);
    });
  });

  describe("when the given component does not have a displayName, but has a function name", () => {
    const mockComponent = () => {};

    beforeEach(() => {
      result = getDisplayName(mockComponent);
    });

    it("should return the function name that constructed the component", () => {
      expect(result).toBe("mockComponent");
    });
  });

  describe("when the given component does not have a displayName or a function name", () => {
    beforeEach(() => {
      result = getDisplayName(() => {});
    });

    it("should return 'Component'", () => {
      expect(result).toBe("Component");
    });
  });
});
