# @acquirejs/mocks

## 0.3.2

### Patch Changes

- Updated dependencies [0c901c0]
  - @acquirejs/core@0.3.2

## 0.3.1

### Patch Changes

- Updated dependencies [88cbf84]
  - @acquirejs/core@0.3.1

## 0.3.0

### Minor Changes

- ec5a56f: Refactored core package (BREAKING CHANGE)

  - Added AcquireBase class to deal with shared middleware.
  - Renamed AcquireRequestExecutor class to AcquireRequestHandler.
  - Reworked AcquireRequestHandlers call signature.
  - Reworked Acquire class to generate request handlers through the createRequestHandler method.
  - Added AcquireRequestHandlerFactory class to deal with request handler creation.
  - Renamed AcquireRequestLogger middleware to RequestLogger.
  - Added DelaySimulator middleware.
  - Updated README.

### Patch Changes

- Updated dependencies [ec5a56f]
  - @acquirejs/core@0.3.0

## 0.2.0

### Patch Changes

- Updated dependencies [8604bfd]
  - @acquirejs/core@0.2.0

## 0.1.0

### Patch Changes

- Updated dependencies [db0dc58]
  - @acquirejs/core@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [99d6bb2]
  - @acquirejs/core@0.0.3

## 0.0.2

### Patch Changes

- 7f530f4: Restricted published files to dist folder
- Updated dependencies [7f530f4]
  - @acquirejs/core@0.0.2

## 0.0.1

### Patch Changes

- b8e42fa: Added warnings on postinstall and README to notify that the version is not yet stable
- Updated dependencies [b8e42fa]
  - @acquirejs/core@0.0.1
