import { render } from "@testing-library/react";
import withCodeSelectionPlugins from "./withCodeSelectionPlugins";
import { forwardRef } from "react";
import getDisplayName from "../getDisplayName";

jest.mock("../getDisplayName", () => jest.fn(({ displayName }) => displayName));

describe("withCodeSelectionPlugins", () => {
  const codeSelectionPlugins = [
    { name: "Plugin1", onCodeSelected: jest.fn() },
    { name: "Plugin2", onCodeSelected: jest.fn(), onSomeOtherThing: () => {} }
  ];
  const rest = {
    testProp: Symbol("test-value"),
    anotherTestProp: Symbol("test-another-value")
  };
  const mockComponent = "test-component";
  const TestComponent = forwardRef(() => (
    <div data-testid={mockComponent}></div>
  ));
  TestComponent.displayName = "test-display-name";

  let Wrapped;

  beforeEach(() => {
    jest.clearAllMocks();
    Wrapped = withCodeSelectionPlugins({
      Component: TestComponent,
      codeSelectionPlugins,
      ...rest
    });
    render(<Wrapped />);
  });

  it("should get the display name of the wrapped component", () => {
    expect(getDisplayName).toHaveBeenCalledWith(TestComponent);
  });

  it("should have a display name that wraps the component in the code selection plugins, in order", () => {
    expect(Wrapped.displayName).toBe(
      `With${codeSelectionPlugins[1].name}(With${codeSelectionPlugins[0].name}(${TestComponent.displayName}))`
    );
  });

  it("should execute the 'onCodeSelected' hooks of all plugins, in reverse order (since first plugin applies closest to the wrapped component), passing the props passed to withPlugins", () => {
    let lastPlugin;
    codeSelectionPlugins.forEach((plugin) => {
      expect(plugin.onCodeSelected).toHaveBeenCalledTimes(1);
      expect(plugin.onCodeSelected).toHaveBeenCalledWith(rest);
      if (lastPlugin) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(plugin.onCodeSelected).toHaveBeenCalledBefore(
          lastPlugin.onCodeSelected
        );
      }
      lastPlugin = plugin;
    });
  });
});
