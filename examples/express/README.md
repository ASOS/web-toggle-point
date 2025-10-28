# Examples

Some example applications based on an [express](https://expressjs.com/) router

1. [animals](./src/routes/animals/README.md)

   This is a basic example using the [`webpack`](../../packages/webpack/docs/README.md) package.

2. [config](./src/routes/config/README.md)

   This example shows the use of the [`react-pointcuts`](../../packages/react-pointcuts/docs/README.md), [`features`](../../packages/features/docs/README.md), [`ssr`](../../packages/ssr/docs/README.md) and [`webpack`](../../packages/webpack/docs/README.md) packages.

3. [parallel-folder-convention](./src/routes/parallel-folder-convention/README.md)

   This example shows the use of the [`react-pointcuts`](../../packages/react-pointcuts/docs/README.md), [`features`](../../packages/features/docs/README.md), [`ssr`](../../packages/ssr/docs/README.md) and [`webpack`](../../packages/webpack/docs/README.md) packages.

   It has a bespoke filesystem convention, with parallel directory hierarchies containing arbitrary replacements and patches of various types of module, including:
      - constants
      - css
      - react components
      - [redux slices](https://redux.js.org/tutorials/essentials/part-2-app-structure#redux-slices)