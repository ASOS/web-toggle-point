# @asos/web-toggle-point-features

This package provides utility modules for managing features state in applications.

It provides global or contextual status of the toggles that should govern relevant modules, passing methods to an appropriate decision-making toggle point (e.g. those created by `withTogglePoint` or `withToggledHook` from the [`react-pointcuts` package](../../react-pointcuts/docs/README.md)).

A store should be chosen based on the requirement for global or partitioned state, and the reactivity needed, for the type of toggle.

## Usage

See: [JSDoc output](https://asos.github.io/web-toggle-point/module-web-toggle-point-features.html)

## Exports

> [!WARNING]
> This package uses [`package.json` exports](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#exports) to specify individual stores (listed below), to ensure that browser / node specific stores can 
> be individually imported and prevent build failures where, prior to tree-shaking, incompatible APIs / globals are referenced.
> Due to [a long-standing bug in `eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import/issues/1810), users of eslint with this plugin may need to ignore an [`import/no-unresolved`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md) error,
> or move to a modern alternative for this plugin (e.g. [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x)), or use [a typescript parser](https://typescript-eslint.io/packages/parser/) (which understands `exports`)

The package contains the following exports:

### `storeFactories/globalFeaturesStoreFactory`

A "global" features store factory: a thin wrapper around a singleton, this is an extension point for future plugins etc.  Each invocation will create a new store, even with a `toggleType` matching a prior invocation.

It accepts the following parameters:
- `toggleType`
  - the type of the toggle, used only for debugging.

It exports a store with:

- a `setValue` function, that sets a current value.
- a `getFeatures` function
   - designed to be passed as the `getActiveFeatures` input of the `withTogglePointFactory` or `withToggledHookFactory` from the [`react-pointcuts` package](../../react-pointcuts/docs/README.md).

For protection against variation (or other) code modifying the toggle state unduly, the value passed could be [deep frozen](https://github.com/christophehurpeau/deep-freeze-es6), e.g.
```js
import { deepFreeze } from "deep-freeze-es6";
const initialValue = {};
featuresStore.setValue({ value: deepFreeze(initialValue) });
```
For reactive values, without the need for a React or other contextual wrapper, consider wrapping an object with [`valtio`](https://github.com/pmndrs/valtio):
```js
import { proxy } from "valtio/vanilla";
const initialValue = {};
featuresStore.setValue({ value: proxy(initialValue) });
```
...which can then be subscribed to in an appropriate toggle point, to re-evaluate toggled functions:
```js
import { subscribe } from "valtio/vanilla";
subscribe(featuresStore.getFeatures(), () => { /* re-evaluate */ });
```
If using React (e.g. `react-pointcuts` package), can just use the native support in Valtio:
```js
import { proxy, useSnapshot } from "valtio";
const initialValue = {};
featuresStore.setValue({ value: proxy(initialValue) });
export const setValue = (input) =>  // consumed in updating code-paths
  featuresStore.setValue({
    value: Object.assign(featuresStore.getFeatures(), input)
  });
export const getActiveFeatures = () => useSnapshot(featuresStore.getFeatures()); // passed to `withTogglePointFactory`
```
...which will then re-render consuming components based on the parts of the toggle state they are reliant on.

### `storeFactories/nodeRequestScopedFeaturesStoreFactory`

A "request scoped" features store factory, for use in [Node](https://nodejs.org/).

It accepts the following parameters:
- `toggleType`
  - the type of the toggle, this is keyed against a singleton referenced by [a runtime-wide global symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#shared_symbols_in_the_global_symbol_registry), to ensure it works across multi-compilation runtimes (e.g. NextJs) / throughout a [realm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#realms).  N.B. Each invocation with the same toggleType will return the initial store.

It exports a store with:
- a `setValue` function that sets a current value, taking a `scopeCallBack` (along with a `value`), under which the value is scoped.
   - This is using [`AsyncLocalStorage.run`](https://nodejs.org/api/async_context.html#asynclocalstoragerunstore-callback-args) under the hood, which can be plugged into Express middleware thus:
      ```js
      import express from "express";

      const app = express();
      const featuresStore = requestScopedFeaturesStoreFactory({ toggleType: "some type of toggle" });

      app.use((request, response, next) => {
        const value = ?? // some value holding toggle state, either based on `request`, or scoped from outside this middleware, etc.
        featuresStore.setValue({ value, scopeCallBack: next });
      });
      app.use("/", () => { /* routes that require toggled code */ });
      ```
- a `getFeatures` function
   - designed to be passed as the `getActiveFeatures` input of the `withTogglePointFactory` or `withToggledHookFactory` from the [`react-pointcuts` package](../../react-pointcuts/docs/README.md).
> [!WARNING]
> This will throw an error if called outside of a request scope, so care should be taken to set up the toggle point config to only toggle modules called within the call stack of the middleware.
> Wrap the `setValue` call in a `try` / `catch`, if prior access is expected.
> If this happens unexpectedly, follow the advice [here](https://nodejs.org/api/async_context.html#troubleshooting-context-loss).

### `storeFactories/reactContextFeaturesStoreFactory`

It accepts the following parameters:
- `toggleType`
  - the type of the toggle, forming the displayName of the react context provider

It exports a store with:
- a `providerFactory` factory function, creating a [react context provider](https://reactjs.org/docs/context.html#contextprovider).
  - appropriate parts of the react tree, that need to have toggled react components, should be wrapped by this provider. It should be passed a value representing active features state.
- a `getFeatures` function
  - this uses [`useContext`](https://react.dev/reference/react/useContext) internally, so should be used honouring the rules of hooks.  It will make consumers reactive to any change of the toggle state.
  - can be passed to `getActiveFeatures` of `withTogglePointFactory` / `withToggledHookFactory` from the [`react-pointcuts` package](../../react-pointcuts/docs/README.md).

### `storeFactories/ssrBackedReactContextFeaturesStoreFactory`

It exports a store with the same signature as that exported by `reactContextFeaturesStoreFactory`.  It utilises `withJsonIsomorphism` from the [`ssr` package](../../ssr/docs/README.md) internally, to create ["isomorphic" or "universal"](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) contexts, for use in framework-less React applications.  The value set on the server will be realised as the initial value within the browser.

It accepts the following parameters:
- `namespace`
  - this becomes a prefix for the `id` of the `application/json` script written to the page, useful for pages running multiple react applications.
- `toggleType`
  - the type of the toggle, the latter part of the `id` of the aforementioned script, and becoming the prop holding the features state, and forming the displayName of the underlying react context provider
- `logWarning`
  - a method to log warnings, should the serialized json somehow become malformed when hydrating the client application
    - this was designed to allow modifications of markup in systems upstream of the origin, but downstream of the browser, with a view to ensure adequate telemetry is in place.

> [!WARNING]
> ### Use with React 17
> The react-specific stores should work with React 17 and above, but due to [a bug](https://github.com/facebook/react/issues/20235) that they are not back-filling, the use of `"type": "module"` in the package means webpack will be unable to resolve the extensionless import.
> To fix, either upgrade to React 18+ or add the following resolve configuration to the webpack config:
> ```js
> resolve: {
>   alias: {
>     "react/jsx-runtime": "react/jsx-runtime.js",
>     "react-dom/server": "react-dom/server.js",
>   }
> }
> ```