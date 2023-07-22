import AcquireBase, {
  AcquireMiddlewareClass,
  AcquireMiddlewareFn
} from "@/classes/AcquireBase.class";

describe("class: AcquireBase", () => {
  let acquireBase: AcquireBase;
  class AcquireBaseTest extends AcquireBase {}

  beforeEach(() => {
    acquireBase = new AcquireBaseTest();
  });

  describe("function: cloneBase", () => {
    it("should clone middleware to the target", () => {
      const middleware: AcquireMiddlewareFn = () => {};
      acquireBase.use(middleware);
      const middlewareWithOrder = [middleware, 0];

      class AcquireBaseCloneTest extends AcquireBase {}

      let acquireBaseClone = new AcquireBaseCloneTest();
      expect(acquireBaseClone["executionMiddlewares"].length).toEqual(0);
      expect(acquireBaseClone["mockingMiddlewares"].length).toEqual(0);

      acquireBaseClone = acquireBase["cloneBase"]().into(acquireBaseClone);

      expect(acquireBaseClone["executionMiddlewares"]).toEqual([
        middlewareWithOrder
      ]);
      expect(acquireBaseClone["mockingMiddlewares"]).toEqual([
        middlewareWithOrder
      ]);
    });
  });

  describe("function: getMiddlewares", () => {
    it("should resolve middlewares in the correct order", () => {
      const middleware1: AcquireMiddlewareFn = () => {};
      const middleware2: AcquireMiddlewareFn = () => {};
      const middleware3: AcquireMiddlewareFn = () => {};

      acquireBase.use(middleware1, 2).use(middleware2, 0).use(middleware3, 1);
      const executionMiddlewares = acquireBase["getMiddlewares"]("execution");
      const mockingMiddlewares = acquireBase["getMiddlewares"]("mocking");

      const resolvedMiddlewares = [middleware2, middleware3, middleware1];

      expect(executionMiddlewares).toEqual(resolvedMiddlewares);
      expect(mockingMiddlewares).toEqual(resolvedMiddlewares);
    });

    it("should return the handle method for class based middlewares", () => {
      class MiddlewareTest implements AcquireMiddlewareClass {
        order = 0;
        handle: AcquireMiddlewareFn<never, unknown, unknown, never, never> =
          () => {};
      }

      const middlewareTest = new MiddlewareTest();
      acquireBase.use(middlewareTest);
      const middlewares = acquireBase["getMiddlewares"]("execution");

      expect(middlewares).toEqual([middlewareTest.handle]);
    });

    it("should resolve middleware functions and classes in the correct order", () => {
      class MiddlewareTest implements AcquireMiddlewareClass {
        order = 1;
        handle: AcquireMiddlewareFn<never, unknown, unknown, never, never> =
          () => {};
      }

      const middlewareClass = new MiddlewareTest();
      const middlewareFn1: AcquireMiddlewareFn = () => {};
      const middlewareFn2: AcquireMiddlewareFn = () => {};

      acquireBase
        .use(middlewareClass)
        .use(middlewareFn1, 0)
        .use(middlewareFn2, 2);

      const middlewares = acquireBase["getMiddlewares"]("execution");

      expect(middlewares).toEqual([
        middlewareFn1,
        middlewareClass.handle,
        middlewareFn2
      ]);
    });

    it("should allow middleware class order to be overridden", () => {
      class MiddlewareTest implements AcquireMiddlewareClass {
        order = 1;
        handle: AcquireMiddlewareFn<never, unknown, unknown, never, never> =
          () => {};
      }

      const middlewareClass = new MiddlewareTest();
      const middlewareFn1: AcquireMiddlewareFn = () => {};
      const middlewareFn2: AcquireMiddlewareFn = () => {};

      acquireBase
        .use(middlewareClass, 0)
        .use(middlewareFn1, 1)
        .use(middlewareFn2, 2);

      const middlewares = acquireBase["getMiddlewares"]("execution");

      expect(middlewares).toEqual([
        middlewareClass.handle,
        middlewareFn1,
        middlewareFn2
      ]);
    });
  });

  describe("function: use", () => {
    it("should add middleware to both execution and mocking middlewares", () => {
      const middleware: AcquireMiddlewareFn = () => {};

      acquireBase.use(middleware);
      const middlewareWithOrder = [middleware, 0];

      expect(acquireBase["executionMiddlewares"]).toEqual([
        middlewareWithOrder
      ]);
      expect(acquireBase["mockingMiddlewares"]).toEqual([middlewareWithOrder]);
    });

    it("should add middleware to both execution and mocking middlewares with order", () => {
      const middleware: AcquireMiddlewareFn = () => {};

      acquireBase.use(middleware, 1);
      const middlewareWithOrder = [middleware, 1];

      expect(acquireBase["executionMiddlewares"]).toEqual([
        middlewareWithOrder
      ]);
      expect(acquireBase["mockingMiddlewares"]).toEqual([middlewareWithOrder]);
    });
  });

  describe("function: useOnExecution", () => {
    it("should add middleware to execution middlewares", () => {
      const middleware: AcquireMiddlewareFn = () => {};

      acquireBase.useOnExecution(middleware);
      const middlewareWithOrder = [middleware, 0];

      expect(acquireBase["executionMiddlewares"]).toEqual([
        middlewareWithOrder
      ]);
      expect(acquireBase["mockingMiddlewares"]).not.toEqual([
        middlewareWithOrder
      ]);
    });
  });

  describe("function: useOnMocking", () => {
    it("should add middleware to execution middlewares", () => {
      const middleware: AcquireMiddlewareFn = () => {};

      acquireBase.useOnMocking(middleware);
      const middlewareWithOrder = [middleware, 0];

      expect(acquireBase["executionMiddlewares"]).not.toEqual([
        middlewareWithOrder
      ]);
      expect(acquireBase["mockingMiddlewares"]).toEqual([middlewareWithOrder]);
    });
  });

  describe("function: clearMiddlewares", () => {
    it("should clear all middlewares", () => {
      const middleware: AcquireMiddlewareFn = () => {};

      acquireBase.use(middleware).use(middleware).use(middleware);

      expect(acquireBase["executionMiddlewares"].length).toEqual(3);
      expect(acquireBase["mockingMiddlewares"].length).toEqual(3);

      acquireBase.clearMiddlewares();

      expect(acquireBase["executionMiddlewares"].length).toEqual(0);
      expect(acquireBase["mockingMiddlewares"].length).toEqual(0);
    });
  });
});
