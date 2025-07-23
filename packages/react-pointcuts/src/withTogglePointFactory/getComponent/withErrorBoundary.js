import { Component, forwardRef, createContext } from "react";
import getDisplayName from "../getDisplayName";

const ForwardedRefContext = createContext();

const withErrorBoundary = ({
  Variant,
  packedBaseModule,
  logError,
  unpackComponent
}) => {
  class TogglePointErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error) {
      error.message = `Variant errored, rendering fallback: ${error.message}`;
      logError(error);
    }

    static contextType = ForwardedRefContext;

    render() {
      const Component = this.state.hasError
        ? unpackComponent(packedBaseModule)
        : Variant;

      return <Component {...this.props} ref={this.context} />;
    }
  }

  const TogglePointErrorBoundaryWithRef = forwardRef((props, ref) => (
    <ForwardedRefContext.Provider value={ref}>
      <TogglePointErrorBoundary {...props} />
    </ForwardedRefContext.Provider>
  ));
  TogglePointErrorBoundaryWithRef.displayName = `withErrorBoundary(${getDisplayName(
    Variant
  )})`;

  return TogglePointErrorBoundaryWithRef;
};

export default withErrorBoundary;
