let useDeferredValue = (value) => value;

(async () => {
  const React = await import("react");
  if (React.useDeferredValue) {
    useDeferredValue = React.useDeferredValue;
  }
})();

export { useDeferredValue };
