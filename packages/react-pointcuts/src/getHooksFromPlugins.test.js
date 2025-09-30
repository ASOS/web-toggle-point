import getHooksFromPlugins from "./getHooksFromPlugins";

describe("getHooksFromPlugins", () => {
  let result;

  describe("when provided some plugins", () => {
    const plugins = [
      { onSomeOtherThing: () => {} },
      { onSomeThing: jest.fn() },
      { onSomeThing: jest.fn(), onSomeOtherThing: () => {} }
    ];

    beforeEach(() => {
      result = getHooksFromPlugins(plugins, "onSomeThing");
    });

    it("should return all plugins that have a binding to the supplied hook", () => {
      expect(result).toEqual(plugins.slice(1));
    });
  });

  describe("when provided no plugins", () => {
    beforeEach(() => {
      result = getHooksFromPlugins(undefined, "onSomeThing");
    });

    it("should return an empty array", () => {
      expect(result).toEqual([]);
    });
  });
});
