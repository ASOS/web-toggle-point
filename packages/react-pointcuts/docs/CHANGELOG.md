# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2025-11-14

### Fixed

- convert deprecated `unstable_config_lookup_from_file` eslint flag to `v10_config_lookup_from_file` now that [its stable](https://eslint.org/docs/latest/flags/#active-flags) awaiting next major version
- reverted errant linebreak

## [0.5.0] - 2025-09-30

### Changed

- Removed `logError` parameter of the `withTogglePointFactory`, replacing with calling of `onVariantError` hook of supplied plugins

### Fixed

- Used the `prepare-publish.mjs` script provided by repo root version [0.12.0](../../../docs/CHANGELOG.md#0120---2025-09-30) to fix relative links in `README.md` on [npmjs.com](https://www.npmjs.com/) that were moved as part of [0.4.7](#047---2025-09-29)

## [0.4.8] - 2025-09-29

### Fixed

- support the `variantKey` parameter for `withToggledHookFactory`, as already existed for `withTogglePointFactory`, which was updated in [version 0.4.0](#040---2024-12-06), but failed to spot this broke the hook version

## [0.4.7] - 2025-09-29

### Fixed

- ensured that `README.md` is included in the root of the npm package, to conform to [npmjs.org requirement](https://docs.npmjs.com/about-package-readme-files):
> An npm package `README.md` file **must** be in the root-level directory of the package.
- ensured that `LICENSE` is included in the npm package

### Added

- [keywords](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#keywords) added to the `package.json` to aid npm search

## [0.4.6] - 2025-08-21

### Fixed

- moved to `default` and `browser` exports from `node` and `default`, to support typescript module resolution

## [0.4.5] - 2025-07-14

### Fixed

- remove redundant `react-dom` dependency

## [0.4.4] - 2025-03-06

### Changed

- added `package.json` [homepage](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#homepage), for clarity once on https://www.npmjs.com/
- added companion note regarding `react-dom/server` when used with React 17

### Fixed

- include the `README.md` in the NPM package

## [0.4.3] - 2025-03-03

### Changed

- Added `package.json` [repository](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository), [bugs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bugs), and [`directories/doc`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#directories) fields, for clarity once on NPM

## [0.4.2] - 2024-12-26

### Fixed

- updated some errant JSDoc namespaces

## [0.4.1] - 2024-12-17

### Removed

- `eslint-plugin-markdownlint` (not used with update to ESLint 9, and was causing issues using `html-react-parser`)

## [0.4.0] - 2024-12-06

### Changed

- updated `withTogglePointFactory` and `withToggledHookFactory` to make then agnostic of React Context
- updated "decisions" to "activeFeatures" nomenclature, throughout (more agnostic of experiment toggle type)
- updated `withTogglePointFactory` to accept a `variantKey`, allowing override a default of `bucket` terminology (which is somewhat "experiment toggle")

## [0.3.1] - 2024-11-27

### Changed

- fixed some typos in docs

## [0.3.0] - 2024-11-27

### Changed

- Updated the factories to accept:
  - a `Map` of features (de-coupling from a webpack-specific data structure)
  - a [javascript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), rather than its `default` export (preparing for support of named exports)
- updated to `react@18.3.1`, set minimum required react to `17`
  - technically a breaking change, but `jsx-runtime` already introduced in [version 0.1.0](#010---2023-09-05)... so was already broken, oops.
- moved package to `"type": "module"` and renamed commonJs exports to have `.cjs` extension to prevent `[ERR_REQUIRE_ESM]` errors in consumers that aren't `"type": "module"`

### Fixed

- Added missing documentation change for plugin interface

## [0.2.1] - 2024-11-25

### Changed

- updates to import attributes from import assertions (Node 22 change in monorepo root)

## [0.2.0] - 2024-10-02

### Changed

- Moved `withTogglePoint` and `withToggledHook` to a plugin interface, de-coupling with experiment activation explicitly

### Fixed

- Added a typedef for the external webpack `RequireContext` to improve documentation
- Removed "plp" nomenclature from the `getMatchedVariants` tests
- Fixed display name for `withErrorBoundary` Higher-Order Component
- Added test case to cover display names (previously excluded due to being dev-only concern, but added now for completeness)

## [0.1.2] - 2024-02-05

### Fixed

- Ensured that react components that are having refs forwarded to them pass that ref down to varied components

## [0.1.1] - 2023-11-16

### Fixed

- Make the fallback "main" entry in package.json be commonJs, since in-case used, this will be old Node
- Make the features package an explicit peer dependency (used to provide activation hook, decisions/audience context)
- Make the webpack package an explicit peer dependency (used to provide requireContext, injection point for point cuts)

## [0.1.0] - 2023-09-05

### Changed

- Re-factored package from `asos-web-toggle-point-app` v1.1.1
- Move to [exports](https://nodejs.org/api/packages.html#exports) in `package.json` (but still fallback to `"main"`, despite not being necessary after Node 12+, due to [this issue](https://github.com/import-js/eslint-plugin-import/issues/1810))
- No longer include corejs in bundle

## [Unreleased] - 2022-02-14

### Fixed

- Corrected docs for output type of `withToggledHook`

## [Unreleased] - 2022-02-10

### Added

- `withToggledHookFactory` to allow toggling of react hooks

## [Unreleased] - 2022-12-20

### Changed

- Removed fuzzy-match on feature name, since no longer a requirement with new Optimizely UI

## [Unreleased] - 2022-10-26

### Added

- Initial commit.
