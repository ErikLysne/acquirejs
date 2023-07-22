---
"@acquirejs/mocks": minor
"@acquirejs/core": minor
---

Refactored core package (BREAKING CHANGE)

- Added AcquireBase class to deal with shared middleware.
- Renamed AcquireRequestExecutor class to AcquireRequestHandler.
- Reworked AcquireRequestHandlers call signature.
- Reworked Acquire class to generate request handlers through the createRequestHandler method.
- Added AcquireRequestHandlerFactory class to deal with request handler creation.
- Renamed AcquireRequestLogger middleware to RequestLogger.
- Added DelaySimulator middleware.
- Updated README.
