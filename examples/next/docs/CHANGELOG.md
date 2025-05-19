# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - ??

### Added

- added a "content management" example, demonstrating use of `withToggledHookFactory` from the `react-pointcuts` package

### Changed

- updated to new webpack plugin
  - moved "experiments" example to use the `lazyComponentLoadStrategyFactory` from `react-pointcuts`
  - new "content management" example utilising the default `deferredRequireLoadStrategyFactory` of `webpack` package
- colocate documentation for "experiments" example to sit with its own `README.mdx`

### Fixed

- consistent "Explanation" and "Activation" sections in example `README.mdx` files

## [0.2.2] - 2024-12-24

### Fixed

- links to folders, not `README.mdx`, in the experiments examples
- create `FeaturesProvider` via factory in outermost scope, rather than on each render of an example

## [0.2.1] - 2024-12-18

### Fixed

- support windows

## [0.2.0] - 2024-12-06

### Changed

- moved project to `"type": "module"`
- used updated `react-pointcuts` package
  - now passing `getActiveFeatures` to `withTogglePointFactory`
- used updated `features` package
  - removing import of contexts and instead using the `reactContextFeaturesStoreFactory`

## [0.1.1] - 2024-11-28

### Added

- added `prebuild` script to ensure dependent workspace packages are built...  may replace with WireIt.

## [0.1.0] - 2024-11-25

### Added

- experiments example, used as fixtures for playwright tests:
  - 1. [Varying a Module](./src/app/fixtures/experiments/1-varied-component/README.mdx)
  - 2. [Varying a Module And It's Dependency](./src/app/fixtures/experiments/2-variant-with-name-matched-dependency/README.mdx)
  - 3. [Extending / Composing a Module in Variation](./src/app/fixtures/experiments/3-varied-component-extending-control/README.mdx)
  - 4. [Varying a Variation](./src/app/fixtures/experiments/4-varied-variant/README.mdx)
  - 5. [Opting Out of Join Points using a local Toggle Config](./src/app/fixtures/experiments/5-toggle-config-opt-out/README.mdx)
  - 6. [Filtering Join Points using a Toggle Config](./src/app/fixtures/experiments/6-toggle-config-variant-filter-same-directory/README.mdx)
  - 7. [Using Varied Code without Toggling its Directory](./src/app/fixtures/experiments/7-toggle-config-variant-filter-alternate-directory/README.mdx)
