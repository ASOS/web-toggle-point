const mockReact = {};
jest.isolateModules(() => {
  jest.mock("react", () => mockReact);
});

describe("useDeferredValueWhereAvailable", () => {
  let useDeferredValue;

  beforeEach(async () => {
    jest.resetModules();
  });

  describe("when the feature is not available", () => {
    it("should not error, and return an identity function", async () => {
      ({ useDeferredValue } = await import("./useDeferredValueWhereAvailable"));
      expect(useDeferredValue).toBeInstanceOf(Function);

      const test = Symbol("test-value");
      expect(useDeferredValue(test)).toBe(test);
    });
  });

  describe("when the feature is available", () => {
    const mockUseDeferredValue = Symbol("test-useDeferredValue");

    beforeEach(async () => {
      mockReact.useDeferredValue = mockUseDeferredValue;
      await Promise.resolve();
      ({ useDeferredValue } = await import("./useDeferredValueWhereAvailable")); // TODO: understand need for double import, why not await Promise.resolve(), process.nextTick() etc. this is a live binding...
      ({ useDeferredValue } = await import("./useDeferredValueWhereAvailable"));
    });

    it("should return the feature from React", () => {
      expect(useDeferredValue).toBe(mockUseDeferredValue);
    });
  });
});
