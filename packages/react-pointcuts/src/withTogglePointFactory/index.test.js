import withTogglePointFactory from ".";
import { render, screen } from "@testing-library/react";
import useCodeMatches from "../useCodeMatches";
import getComponent from "./getComponent";
import getCodeSelectionPlugins from "../getCodeSelectionPlugins";
import { createRef, forwardRef, lazy } from "react";
import getDisplayName from "./getDisplayName";

const mockMatches = {};
jest.mock("../useCodeMatches", () => jest.fn(() => mockMatches));
const mockCodeSelectionPlugins = Symbol("test-code-selection-plugins");
jest.mock("../getCodeSelectionPlugins", () =>
  jest.fn(() => mockCodeSelectionPlugins)
);
const mockVariedComponent = "test-component";
const MockVariedComponent = forwardRef(
  jest.fn((_, ref) => <div ref={ref} data-testid={mockVariedComponent} />)
);

jest.mock("./getComponent", () => jest.fn(() => MockVariedComponent));
const mockDisplayName = "test-display-name";
jest.mock("./getDisplayName", () => jest.fn(() => mockDisplayName));

describe("withTogglePointFactory", () => {
  let rerender;
  const featuresMap = Symbol("test-features-map");
  const inboundProps = { "test-prop": Symbol("test-value") };
  const logError = Symbol("test-log-error");
  const mockPlugins = [Symbol("test-plugin1"), Symbol("test-plugin2")];
  const mockActiveFeatures = Symbol("test-active-features");
  const getActiveFeatures = jest.fn(() => mockActiveFeatures);
  const mockComponentModule = { default: () => <div>test-component</div> };

  let Toggled, createMockVariant;

  describe.each`
    inputVariantKey | expectedVariantKey
    ${undefined}    | ${"bucket"}
    ${"test-key"}   | ${"test-key"}
  `(
    "when given a variant key of $inputVariantKey",
    ({ inputVariantKey, expectedVariantKey }) => {
      let unpack;

      const makeCommonAssertions = ({ joinPoint }) => {
        beforeEach(() => {
          mockMatches.matchedFeatures = Symbol("test-features");
          jest.clearAllMocks();
          const withTogglePoint = withTogglePointFactory({
            getActiveFeatures,
            logError,
            variantKey: inputVariantKey,
            plugins: mockPlugins
          });
          Toggled = withTogglePoint({ joinPoint, featuresMap, unpack });
        });

        it("should get code selection plugins", () => {
          expect(getCodeSelectionPlugins).toHaveBeenCalledWith(mockPlugins);
        });

        const makeRenderedAssertions = () => {
          it("should check for code matches, based on the result of the getActiveFeatures method passed and the potential code paths on disk", () => {
            expect(useCodeMatches).toHaveBeenCalledWith({
              featuresMap,
              variantKey: expectedVariantKey,
              activeFeatures: mockActiveFeatures
            });
          });

          it("should render the (potentially) varied component, passing the inbound props provided to the HOC", () => {
            expect(screen.getByTestId(mockVariedComponent)).toBeInTheDocument();
            const ref = expect.toBeOneOf([null, expect.anything()]);
            expect(MockVariedComponent.render).toHaveBeenCalledWith(
              inboundProps,
              ref
            );
          });
        };

        const makeGetComponentAssertions = () => {
          it("should get a component, based on the matched features, matched variant, code require context and input component as a fallback, passing the appropriate plugins that include a code selection hook", () => {
            const { matchedFeatures, matchedVariant } = mockMatches;
            expect(getComponent).toHaveBeenCalledWith({
              matchedFeatures,
              matchedVariant,
              logError,
              packedBaseModule: joinPoint,
              unpackComponent: expect.any(Function),
              plugins: mockCodeSelectionPlugins
            });
          });

          describe("When the get component function uses the unpackComponent method passed", () => {
            beforeEach(() => {
              const { unpackComponent } = getComponent.mock.calls[0][0];
              unpackComponent(mockMatches.matchedVariant);
            });

            it("should unpack the module", () => {
              expect(unpack).toHaveBeenCalledWith(mockMatches.matchedVariant);
            });
          });
        };

        const makeCommonAssertions = () => {
          makeRenderedAssertions();
          makeGetComponentAssertions();

          it("should prepare a display name based on the display name of the joinPoint", () => {
            expect(getDisplayName).toHaveBeenCalledWith(joinPoint);
            expect(Toggled.displayName).toBe(
              `withTogglePoint(${mockDisplayName})`
            );
          });

          describe("when the component re-renders", () => {
            beforeEach(() => {
              getComponent.mockClear();
            });

            describe("and the matched features have updated", () => {
              beforeEach(() => {
                mockMatches.matchedFeatures = Symbol("test-new-features");
              });

              describe("and the matched variant has updated", () => {
                beforeEach(() => {
                  mockMatches.matchedVariant = createMockVariant();
                  rerender(<Toggled {...inboundProps} />);
                });

                makeRenderedAssertions();
                makeGetComponentAssertions();
              });

              describe("and the matched variant has not updated", () => {
                beforeEach(() => {
                  rerender(<Toggled {...inboundProps} />);
                });

                makeRenderedAssertions();
                makeGetComponentAssertions();
              });
            });

            describe("and the active features have not updated", () => {
              beforeEach(() => {
                rerender(<Toggled {...inboundProps} />);
              });

              it("should not get the component again, to avoid needless re-execution", () => {
                expect(getComponent).not.toHaveBeenCalled();
              });

              makeRenderedAssertions();
            });
          });
        };

        describe("When the consumer passes a ref", () => {
          const mockRef = createRef();

          beforeEach(() => {
            ({ rerender } = render(
              <Toggled {...inboundProps} ref={mockRef} />
            ));
          });

          it("should pass the ref to the varied component", () => {
            expect(screen.getByTestId(mockVariedComponent)).toBe(
              mockRef.current
            );
          });

          makeCommonAssertions();
        });

        describe("When the consumer does not pass a ref", () => {
          beforeEach(() => {
            ({ rerender } = render(<Toggled {...inboundProps} />));
          });

          makeCommonAssertions();
        });
      };

      describe("when the given joinPoint is a lazy component", () => {
        beforeEach(() => {
          createMockVariant = () =>
            lazy(Promise.resolve(Symbol("test-variant")));
          unpack = jest.fn((module) => module);
          mockMatches.matchedVariant = createMockVariant();
        });

        makeCommonAssertions({
          joinPoint: lazy(Promise.resolve(mockComponentModule))
        });
      });

      describe("when the given joinPoint is not a lazy component", () => {
        beforeEach(() => {
          createMockVariant = () => ({ default: Symbol("test-variant") });
          unpack = jest.fn((module) => module.default);
          mockMatches.matchedVariant = createMockVariant();
        });

        makeCommonAssertions({
          joinPoint: mockComponentModule
        });
      });
    }
  );
});
