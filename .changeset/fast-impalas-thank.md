---
"@acquirejs/core": minor
---

Added support for middleware on the `Acquire` and `AcquireRequestExecutor` classes. Middleware can be applied using the `use`, `useOnExecution` and `useOnMocking` methods.
Removed `setMockInterceptor` and `clearMockInterceptor` methods from the `AcquireRequestExecutor` class. Intercepting mock calls should now be done using middleware.
Removed the `useLogger` method from the `Acquire` class. Logging can now be done using the `AcquireRequestLogger` middleware.
