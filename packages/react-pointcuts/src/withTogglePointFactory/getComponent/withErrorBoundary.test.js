/* eslint-disable no-console */
import withErrorBoundary from "./withErrorBoundary";
import { render, screen } from "@testing-library/react";
import { createRef, forwardRef } from "react";
import getDisplayName from "../getDisplayName";

const mockLogError = jest.fn();

const mockDisplayName = "test-display-name";
jest.mock("../getDisplayName", () => jest.fn(() => mockDisplayName));

describe("withErrorBoundary", () => {
  const inboundProps = { "test-prop": Symbol("test-value") };
  const mockBaseModule = "test-mock-base-module";
  const MockBaseModule = forwardRef(
    jest.fn((_, ref) => <div ref={ref} data-testid={mockBaseModule} />)
  );
  const mockVariant = "test-mock-variant";
  const MockVariant = forwardRef(
    jest.fn((_, ref) => <div ref={ref} data-testid={mockVariant} />)
  );
  const mockErrorMessage = "test-error";
  const mockRef = createRef();
  const unpackComponent = jest.fn((module) => module);
  let mockError;
  const MockErrorVariant = () => {
    throw mockError;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockError = new Error(mockErrorMessage);
  });

  let Boundaried;

  const makeCommonAssertions = () => {
    it("should have a display name that wraps the component in the error boundary", () => {
      expect(Boundaried.displayName).toBe(
        `withErrorBoundary(${mockDisplayName})`
      );
    });
  };

  describe("when rendering the variant and no error occurs", () => {
    beforeEach(() => {
      Boundaried = withErrorBoundary({
        Variant: MockVariant,
        packedBaseModule: MockBaseModule,
        logError: mockLogError,
        unpackComponent
      });
      render(<Boundaried {...inboundProps} ref={mockRef} />);
    });

    makeCommonAssertions();

    it("should get the display name of the variant passed", () => {
      expect(getDisplayName).toHaveBeenCalledWith(MockVariant);
    });

    it("should render the variant, passing the inbound props, and not render the fallback", () => {
      const variantElement = screen.getByTestId(mockVariant);
      expect(variantElement).toBeInTheDocument();
      expect(variantElement).toBe(mockRef.current);
      expect(MockVariant.render).toHaveBeenCalledWith(inboundProps, mockRef);
      expect(screen.queryByTestId(mockBaseModule)).not.toBeInTheDocument();
    });

    it("should not log anything", () => {
      expect(mockLogError).not.toHaveBeenCalled();
    });
  });

  describe("when rendering the variant and an error occurs", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const Boundaried = withErrorBoundary({
        Variant: MockErrorVariant,
        packedBaseModule: MockBaseModule,
        logError: mockLogError,
        unpackComponent
      });
      render(<Boundaried {...inboundProps} ref={mockRef} />);
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    makeCommonAssertions();

    it("should get the display name of the variant passed", () => {
      expect(getDisplayName).toHaveBeenCalledWith(MockErrorVariant);
    });

    it("should unpack the fallback component", () => {
      expect(unpackComponent).toHaveBeenCalledWith(MockBaseModule);
    });

    it("should render the fallback, passing the inbound props, and no longer render the variant", () => {
      const fallbackElement = screen.getByTestId(mockBaseModule);
      expect(fallbackElement).toBeInTheDocument();
      expect(fallbackElement).toBe(mockRef.current);
      expect(MockBaseModule.render).toHaveBeenCalledWith(inboundProps, mockRef);
      expect(screen.queryByTestId(mockVariant)).not.toBeInTheDocument();
    });

    it("should log an error indicating that the fallback has been rendered", () => {
      expect(mockLogError).toHaveBeenCalledWith(mockError);
    });

    it("should update the message on the error to include that the variant has errored", () => {
      expect(mockError.message).toBe(
        `Variant errored, rendering fallback: ${mockErrorMessage}`
      );
    });
  });
});
