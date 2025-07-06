import getHooksFromPlugins from "./getHooksFromPlugins";

describe("getHooksFromPlugins", () => {
  let result;
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
