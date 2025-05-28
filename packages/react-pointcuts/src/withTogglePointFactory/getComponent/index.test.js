import getComponent from "./index";
import withErrorBoundary from "./withErrorBoundary";
import withPlugins from "./withPlugins";
import { render, screen } from "@testing-library/react";
import { createRef, forwardRef } from "react";
import getDisplayName from "../getDisplayName";

jest.mock("./withErrorBoundary", () => jest.fn());
jest.mock("./withPlugins", () => jest.fn());
const mockDisplayName = "test-display-name";
jest.mock("../getDisplayName", () => jest.fn(() => mockDisplayName));

const mockVariantComponent = "test-variant-component";
const MockVariantComponent = forwardRef(
  jest.fn((_, ref) => <div ref={ref} data-testid={mockVariantComponent} />)
);

const unpackMarker = Symbol("test-unpack-marker");
const unpackComponent = jest.fn().mockImplementation((module) => {
  module[unpackMarker] = true;
  return module;
});

describe("getComponent", () => {
  let result, params;
  const pluginMarker = Symbol("test-plugin-marker");

  beforeEach(() => {
    jest.clearAllMocks();
    params = {
      logError: Symbol("test-error-logger"),
      packedBaseModule: () => Symbol("test-base-component"),
      unpackComponent
    };
    withPlugins.mockImplementation(({ component }) => {
      component[pluginMarker] = true;
      return component;
    });
  });

  const makeCommonAssertions = (makeExtraAssertions = () => {}) => {
    const makeFallbackAssertion = () => {
      it("should return the unpacked base component", () => {
        expect(unpackComponent).toHaveBeenCalledWith(params.packedBaseModule);
        expect(result).toBe(params.packedBaseModule);
        expect(result[unpackMarker]).toBe(true);
      });
    };

    describe("when there are no matched features", () => {
      beforeEach(() => {
        params = {
          ...params,
          matchedFeatures: [],
          matchedVariant: null
        };
        result = getComponent(params);
      });

      makeExtraAssertions();
      makeFallbackAssertion();
    });

    describe("when there are matched features", () => {
      const matchedFeatures = [Symbol("test-matched-feature")];
      beforeEach(() => {
        params = {
          ...params,
          matchedFeatures
        };
      });

      describe("and there is no matched variant", () => {
        beforeEach(() => {
          params = {
            ...params,
            matchedVariant: null
          };
          result = getComponent(params);
        });

        makeExtraAssertions();
        makeFallbackAssertion();
      });

      describe("and there is a matched variant", () => {
        const errorBoundariedMarker = Symbol("test-error-boundaried-marker");
        const innateProp = "test-innate-prop";
        const variables = {
          "test-variable-key": Symbol("test-variable-value-1"),
          [innateProp]: Symbol("test-variable-value-2")
        };

        beforeEach(() => {
          withErrorBoundary.mockImplementation(({ Variant }) => {
            Variant[errorBoundariedMarker] = true;

            return Variant;
          });
          params = {
            ...params,
            matchedVariant: {
              packedModule: MockVariantComponent,
              variables
            }
          };
          result = getComponent(params);
        });

        it("should wrap the variant with an error boundary, to ensure errors in the variant result in falling back to the base/default component", () => {
          const { packedBaseModule: Component } = params;
          expect(withErrorBoundary).toHaveBeenCalledWith({
            logError: params.logError,
            Variant: expect.anything(),
            packedBaseModule: Component,
            unpackComponent
          });
          expect(result[errorBoundariedMarker]).toBe(true);
        });

        it("should set a display name on the variant", () => {
          const [[{ Variant }]] = withErrorBoundary.mock.calls;
          expect(getDisplayName).toHaveBeenCalledWith(MockVariantComponent);
          expect(Variant.displayName).toEqual(`Variant(${mockDisplayName})`);
        });

        makeExtraAssertions();

        describe("when the returned component is rendered", () => {
          const componentProps = {
            "test-component-prop": Symbol("test-component-prop-value"),
            [innateProp]: Symbol("test-innate-prop-value")
          };
          const mockRef = createRef();

          beforeEach(() => {
            const Component = result;
            render(<Component {...componentProps} ref={mockRef} />);
          });

          it("should return the unpacked variant component", () => {
            expect(unpackComponent).toHaveBeenCalledWith(
              params.matchedVariant.packedModule
            );
            expect(MockVariantComponent[unpackMarker]).toBe(true);
          });

          it("should render the variant, sending down any innate props, attaching the passed ref, and any variables from the feature as props (preferring innate props over variables - so features can't overwrite innate/in-built props)", () => {
            const variantElement = screen.getByTestId(mockVariantComponent);
            expect(variantElement).toBeInTheDocument();
            expect(variantElement).toBe(mockRef.current);
            expect(MockVariantComponent.render).toHaveBeenCalledWith(
              expect.objectContaining({ ...variables, ...componentProps }),
              mockRef
            );
          });
        });
      });
    });
  };

  describe("when plugins are passed", () => {
    beforeEach(() => {
      params = {
        ...params,
        plugins: Symbol("test-plugins")
      };
    });

    makeCommonAssertions(() => {
      it("should run plugins on the the matched features, passing the params that were passed to the component, in-case the plugins need them", () => {
        const { plugins, ...rest } = params;
        expect(withPlugins).toHaveBeenCalledWith({
          component: result,
          plugins,
          ...rest
        });
        expect(result[pluginMarker]).toBe(true);
      });
    });
  });

  describe("when no plugins are passed", () => {
    beforeEach(() => {
      params = {
        ...params,
        plugins: null
      };
    });

    makeCommonAssertions();
  });
});
