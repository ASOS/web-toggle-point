# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2025-07-17

### Added

- "load strategy" concept
  - provide `moduleLoadStrategyFactories` exports: `staticLoadStrategyFactory`, `deferredRequireLoadStrategyFactory`, `deferredDynamicImportLoadStrategyFactory`

### Changed

- changed description of package to better indicate it contains more than just a plugin
- renamed `TogglePointInjection` to `TogglePointInjectionPlugin` to follow Webpack recommended naming convention
- renamed `togglePointModule` to `togglePointModuleSpecifier` to better describe [the type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_features_into_your_script)
- updated webpack version to 5.99.7
- consolidated setting of default optional values
- changed `variants` array on join point data structure to a `Map` of relative to absolute path as `variantPathMap`
- move away from webpack `import.meta.webpackContext` when generating join points, expect load strategies to construct context/maps instead
  - add linking of join points, to supplant the functionality previously provided by `import.meta.webpackContext`
- various internal variable renames for clarity
- wrapped "toggle handlers" in a factory method, to support `togglePoint`, `pack` and `unpack` being passed during setup, simplifying the toggle handler interface
  - move `toggleHandler/pathSegmentToggleHandler` to `toggleHandlerFactories/pathSegment`
- updated win32 path replacement, can effectively no-op on posix systems

### Fixed

- removed "next" peer dependency, this needn't be explicit
- ensured files that cannot be resolved (by [enhanced-resolve](https://github.com/webpack/enhanced-resolve/)), for whatever reason, don't break the build

## [0.8.0] - 2025-05-27

### Changed

- moved to accept an array for variant globs in the plugin, allowing cherry-picking of disparately-located files to be selected where a common pattern does not apply

## [0.7.5] - 2025-03-06

### Changed

- added `package.json` [homepage](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#homepage), for clarity once on https://www.npmjs.com/

### Fixed

- fixed typo in JSDoc comment
- fixed typo in `README.md`
- include the `README.md` in the NPM package

## [0.7.4] - 2025-03-03

### Changed

- added `package.json` [repository](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository), [bugs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bugs), and [`directories/doc`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#directories) fields, for clarity once on NPM

## [0.7.3] - 2024-12-26

### Fixed

- updated some errant JSDoc namespaces

## [0.7.2] - 2024-12-17

### Removed

- `eslint-plugin-markdownlint` (not used with update to ESLint 9, and was causing issues using `html-react-parser`)

### Fixed

- updated errant `main` in `package.json` (only to keep jest/linters happy) to point to an actual file

## [0.7.1] - 2024-12-18

### Fixed

- support windows

## [0.7.0] - 2024-12-08

### Added

- added note to docs regarding singular plugin instances

## [0.6.0] - 2024-12-06

### Changed

- updated docs to hint at `eslint-plugin-import/no-named-export`

## [0.5.1] - 2024-11-27

### Changed

- fixed some typos in docs

## [0.5.0] - 2024-11-27

### Changed

- moved to use fully filesystem convention-based toggle points & flexible convention support

### Added

- added tacit support for Next 14+

## [0.4.0] - UNRELEASED

### Changed

- move to use [`import.meta.webpackContext`](https://webpack.js.org/api/module-variables/#importmetawebpackcontext) over [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext), to be closer to emergent web standards.

## [0.3.2] - 2024-11-25

### Changed

- updates to import attributes from import assertions (Node 22 change in monorepo root)

## [0.3.1] - 2023-10-23

### Changed

- moved build to use `rollup-plugin-auto-external` in place of `rollup-plugin-peer-deps-external`
- clarified that cjs module output is es5, for consistency with other packages
- Move to [exports](https://nodejs.org/api/packages.html#exports) in `package.json`

### Fixed

- supported default of `__variants__` for `variantsFolder` as described in the docs

## [0.3.0] - 2023-09-12

### Added

- A `lint:fix` script

### Changed

- Updated `jest` to version 28 to resolve snyk issue

## [0.2.1] - 2023-09-12

### Changed

- Moved to `npm` from `yarn`

## [0.2.0] - 2023-02-10

### Added

- Move to config to allow multiple toggle point cuts

### Removed

- Remove single test / togglePointPath

## [0.1.0] - 2022-10-26

### Added

- Initial commit
