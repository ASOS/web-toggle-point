# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - ??

### Changed

- moved to `production` webpack mode with `source-map` devtool and `source-map-loader`, for clarity when using dev tools
- updates for new `webpack` package:
  - moving to `toggleHandlerFactories` from `toggleHandlers`
  - using non-default `loadStrategy` for two of the four examples
    - `audience` becomes `deferredImport` (`async`)
    - `translation` becomes `static` (which was the previous default...)
    - other default to `deferredRequire` (synchronous, but delayed require of module)
- move to use `import.meta.resolve` replacing the hand-rolled `getToggleHandlerPath.js`
- move `toggleHandlers` to `toggleHandlerFactories`, to align with updated `webpack` package

## [0.2.3] - 2025-02-27

### Changed

- updated some linux playwright snapshots
  - no code changes, so this must be a change in linux chromium. Assets look identical to eye, so presumably need to relax the fuzziness.

## [0.2.2] - 2024-12-17

### Removed

- `eslint-plugin-markdownlint` (not used with update to ESLint 9, and was causing issues using `html-react-parser`)

## [0.2.1] - 2024-12-18

### Fixed

- support windows

## [0.2.0] - 2024-12-06

### Changed

- used updated `features` package
  - removing hand-rolled global state and instead using the `globalFeaturesStoreFactory`

## [0.1.0] - 2024-11-25

### Added

- examples and playwright tests using these as fixtures:
  - 1. selecting a translations JSON file based on [`navigator.language`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).
  - 2. selecting a site-specific method, based on a site prefix of the url.
  - 3. selecting an cohort-specific method, based on an audience cookie.
  - 4. selecting a theme-specific method, based on a date
