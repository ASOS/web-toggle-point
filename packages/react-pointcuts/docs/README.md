# @asos/web-toggle-point-react-pointcuts

This package provides react application pointcut code, acting as a target toggle point injected by the [`TogglePointInjectionPlugin`](../../webpack/docs/README.md).

It is designed for a features store that has "features" and "variants" of features, held in a two-level `Map`.

It contains the following exports from the base package (`@asos/web-toggle-point-react-pointcuts`):

- `withTogglePointFactory`

This is a factory function used to create a `withTogglePoint` [react higher-order component](https://reactjs.org/docs/higher-order-components.html).

- `withToggledHookFactory`

This is a factory function used to create a [hook](https://reactjs.org/docs/hooks-intro.html)-wrapping function.

The product of both these factories receive the outcome of the webpack plugin, used to choose appropriate variants at runtime, based on decisions from a supplied context.

Both accept plugins, currently supporting a hook called during code activation (mounting of the  component, or calling the hook).

It also contains a package export:

- `@asos/web-toggle-point-react-pointcuts/lazyComponentLoadStrategyFactory`

This is a factory for a load strategy for use with the webpack [`TogglePointInjectionPlugin`](../../webpack/docs/README.md) for when lazy-loading / code splitting is desired.

> [!NOTE]
>
> In SSR scenarios, a streaming render should be used (i.e. [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) or [`renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream)) when using this load strategy, as is inherent with [`React.lazy`](https://react.dev/reference/react/lazy), otherwise the following error will be produced:
>
> > Error: A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with `startTransition`.

## Usage

The package has a peer dependency requirement of [`react`](https://github.com/facebook/react/tree/main/packages/react) (with version-matched [`react-is`](https://github.com/facebook/react/tree/main/packages/react-is)), and should work with React 17 and above.

See: [JSDoc output](https://asos.github.io/web-toggle-point/module-web-toggle-point-react-pointcuts.html)

> [!WARNING]
> ### Use with React 17
> The package should work with React 17 and above, but due to [a bug](https://github.com/facebook/react/issues/20235) that they are not back-filling, the use of `"type": "module"`
> in the package means webpack will be unable to resolve the extensionless import.
> To fix, either upgrade to React 18+ or add the following resolve configuration to the webpack config:
> ```js
> resolve: {
>   alias: {
>     "react/jsx-runtime": "react/jsx-runtime.js",
>     "react-dom/server": "react-dom/server.js",
>   }
> }
> ```

> [!IMPORTANT]
>
> Since React 17 does not support suspense for code splitting during server-side rendering, where a `lazyComponentLoadStrategyFactory` strategy is used, this will preclude the use of Server-Side Rendering.  You will receive the following:
>
> > ReactDOMServer does not yet support Suspense.

> [!WARNING]
> ### Use with NextJS
> The package will work with NextJs (see caveats in [next example](../../../examples/next/README.md)), but since NextJs uses it's own "pre-compiled" versions of 
> `react` and `react-is`, the `Symbol` used to mark react types needs to be aligned, since this package uses `react-is` to detect if a toggled component is "lazy" or not.
> To ensure that the next-specific version of `react-is` is used by the application build, it can be aliased in the webpack config of the NextJs app thus:
> ```js
> resolve: {
>   alias: {
>     "react-is": `next/dist/compiled/react-is/cjs/react-is.${process.env.NODE_ENV === "production" ? "production" : "development"}.js`
>   }
>}
> ```
> N.B. The compiled entrypoint for CJS doesn't re-export named exports properly, so you'll need to select the production or development build as appropriate, as shown.  The above works for Next 15, for Next 14 the production bundle is `react-is.production.min.js`
