# Next JS example

These examples show the use of the [`react-pointcuts`](../../packages/react-pointcuts/docs/README.md), [`features`](../../packages/features/docs/README.md) and [`webpack`](../../packages/webpack/docs/README.md) packages, as part of an ["app router"](https://nextjs.org/docs/app) [Next.js](https://nextjs.org/) application.

N.B. NextJs support is currently experimental, see [caveats](#caveats).

## Examples

1. [content management](./src/app/fixtures/content-management/README.mdx)

   This is a basic example demonstrating the ability to vary react hooks, using a contrived content management feature.

2. [experiments](./src/app/fixtures/experiments/README.mdx)

   These examples show various toggle setups with react components being varied, opting out of variation, etc.

## Caveats

- Only client components can be toggled using a per-request features store, since request-bound context is not supported by server components.  They are not meant to be stateful
  - API routes may be supportable, via use of [an async local storage wrapper](https://github.com/rexfordessilfie/nextwrappers/tree/main/packages/async-local-storage), once support for named exports is added ([Issue #4](https://github.com/ASOS/web-toggle-point/issues/4)) - since would need to match the HTTP verbs
- The webpack package cannot currently vary some of NextJs' [filesystem convention files](https://nextjs.org/docs/pages/getting-started/project-structure#files-conventions) ([Issue #9](https://github.com/ASOS/web-toggle-point/issues/9))
- The `webpack` plugin uses webpack hooks, so is incompatible with the new TurboPack bundler
- The `webpack` plugin uses Node JS APIs to access the filesystem, so may be incompatible with [the edge runtime](https://nextjs.org/docs/app/api-reference/edge#unsupported-apis)
- The `webpack` plugin's default loading strategy (`deferredRequire`) is incompatible with the pages router in Next 14 (and presumed below), due to [issues](https://github.com/vercel/next.js/discussions/37520) whereby next converts deferred require into a `Promise`. It's fixed in Next 15
- The `nodeRequestScopedFeaturesStoreFactory` relies on singleton values held in top-level scope, which Next does not support due to [issues](https://github.com/vercel/next.js/issues/65350#issuecomment-2318650615).  This may be mitigated via use of a cross-realm Symbol (see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#shared_symbols_in_the_global_symbol_registry)) in a future update, as works with [`express-http-context`](https://github.com/skonves/express-http-context)