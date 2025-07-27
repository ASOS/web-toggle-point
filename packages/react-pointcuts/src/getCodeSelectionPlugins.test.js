import getCodeSelectionPlugins from "./getCodeSelectionPlugins";

describe("getCodeSelectionPlugins", () => {
  let result;

  describe("when no plugins are provided", () => {
    beforeEach(() => {
      result = getCodeSelectionPlugins();
    });

    it("should return null, and not error", () => {
      expect(result).toEqual(null);
    });
  });

  describe("when plugins are provided", () => {
    const plugins = [
      { onSomeOtherThing: () => {} },
      { onCodeSelected: jest.fn() },
      { onCodeSelected: jest.fn(), onSomeOtherThing: () => {} }
    ];

    beforeEach(() => {
      result = getCodeSelectionPlugins(plugins);
    });

    it("should return all plugins that have a binding to the 'onCodeSelected' hook", () => {
      expect(result).toEqual(plugins.slice(1));
    });
  });
});