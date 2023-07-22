# @acquirejs/core

## 0.3.1

### Patch Changes

- 88cbf84: Removed reflect-metadata import from core package

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

## 0.2.0

### Minor Changes

- 8604bfd: Added support for middleware on the `Acquire` and `AcquireRequestExecutor` classes. Middleware can be applied using the `use`, `useOnExecution` and `useOnMocking` methods.
  Removed `setMockInterceptor` and `clearMockInterceptor` methods from the `AcquireRequestExecutor` class. Intercepting mock calls should now be done using middleware.
  Removed the `useLogger` method from the `Acquire` class. Logging can now be done using the `AcquireRequestLogger` middleware.

## 0.1.0

### Minor Changes

- db0dc58: Updated transform decorators to use a common options interface.
  Renamed ToLowerCase, ToUpperCase and Trim decorators to ToLowerCaseString, ToUpperCaseString and ToTrimmedString for consistent naming.
  Added support for decimalSeparator and thousandSeparator on ToNumber decorator.

## 0.0.3

### Patch Changes

- 99d6bb2: Added decorators ToBoolean, ToDate, ToLowerCase, ToString, ToUpperCase and Trim

## 0.0.2

### Patch Changes

- 7f530f4: Restricted published files to dist folder

## 0.0.1

### Patch Changes

- b8e42fa: Added warnings on postinstall and README to notify that the version is not yet stable
