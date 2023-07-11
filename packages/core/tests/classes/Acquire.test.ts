import { Acquire } from "@/classes/Acquire.class";
import { AcquireRequestExecutor } from "@/classes/AcquireRequestExecutor.class";

describe("class: Acquire", () => {
  const acquire = new Acquire();

  const requestExecutorExecuteSpy = jest
    .spyOn(AcquireRequestExecutor.prototype, "execute")
    .mockImplementation(() => Promise.resolve() as any);

  const requestExecutorMockSpy = jest
    .spyOn(AcquireRequestExecutor.prototype, "mock")
    .mockImplementation(() => Promise.resolve() as any);

  beforeEach(() => {
    acquire.disableMocking();
  });

  afterEach(() => {
    requestExecutorExecuteSpy.mockClear();
    requestExecutorMockSpy.mockClear();
  });

  describe("executing callable instance", () => {
    it("should call execute on AcquireRequestExecutor with the correct value arguments", async () => {
      const getUser = acquire({
        request: {
          url: "https://example.com/user/1",
          headers: { Authorization: "Bearer token" }
        }
      });

      await getUser();

      expect(requestExecutorExecuteSpy).toHaveBeenCalledWith({
        request: {
          url: "https://example.com/user/1",
          headers: { Authorization: "Bearer token" }
        }
      });
    });
  });

  describe("mocking callable instance", () => {
    it("should call mock on AcquireRequestExecutor with the correct value arguments", async () => {
      const getUser = acquire({
        request: {
          url: "https://example.com/user/1",
          headers: { Authorization: "Bearer token" }
        }
      });

      await getUser.mock();

      expect(requestExecutorMockSpy).toHaveBeenCalledWith({
        request: {
          url: "https://example.com/user/1",
          headers: { Authorization: "Bearer token" }
        }
      });
    });
  });

  describe("function: withCallArgs", () => {
    it("should call execute on AcquireRequestExecutor with the acquireArgs and callArgs", async () => {
      const getUrl = (args?: { userId: number }): string =>
        `https://example.com/user/${args?.userId}`;

      class UserModel {}

      const getUser = acquire.withCallArgs<{ userId: number }>()({
        request: {
          url: getUrl
        },
        responseMapping: {
          Model: UserModel
        }
      });

      await getUser({ userId: 10 });

      expect(requestExecutorExecuteSpy).toHaveBeenCalledWith(
        {
          request: {
            url: getUrl
          },
          responseMapping: {
            Model: UserModel
          }
        },
        { userId: 10 }
      );
    });
  });

  describe("function: isAcquireInstance", () => {
    it("should return true when called with an instance of Acquire", () => {
      const acquire = new Acquire();

      expect(Acquire.isAcquireInstance(acquire)).toBe(true);
    });

    it("should return false for any other input", () => {
      expect(Acquire.isAcquireInstance({})).toBe(false);
      expect(Acquire.isAcquireInstance(undefined)).toBe(false);
      expect(Acquire.isAcquireInstance(null)).toBe(false);
      expect(Acquire.isAcquireInstance(123)).toBe(false);
      expect(Acquire.isAcquireInstance("abc")).toBe(false);
    });
  });
});
