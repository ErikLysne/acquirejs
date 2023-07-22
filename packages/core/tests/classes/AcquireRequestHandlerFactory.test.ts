import {
  AcquireRequestHandler,
  AcquireRequestHandlerConfig
} from "@/classes/AcquireRequestHandler.class";
import AcquireRequestHandlerFactory from "@/classes/AcquireRequestHandlerFactory.class";

jest.mock("@/classes/AcquireRequestHandler.class");

describe("class: AcquireRequestHandlerFactory", () => {
  const mockGetConfig = jest.fn(
    () => ({})
  ) as unknown as () => AcquireRequestHandlerConfig;

  let factory: AcquireRequestHandlerFactory;

  class UserDTO {
    id: number;
    name: string;
    age: number;
  }

  class UserModel {
    id: number;
    name: string;
    age: number;
  }

  beforeEach(() => {
    factory = new AcquireRequestHandlerFactory(mockGetConfig);
  });

  describe("function: withResponseMapping", () => {
    it("should return a new AcquireRequestHandlerFactory with specified response mapping", () => {
      const newFactory = factory.withResponseMapping(UserModel, UserDTO);

      expect(newFactory).toBeInstanceOf(AcquireRequestHandlerFactory);
      expect(newFactory["responseModel"]).toEqual(UserModel);
      expect(newFactory["responseDTO"]).toEqual(UserDTO);
    });
  });

  describe("function: withRequestMapping", () => {
    it("should return a new AcquireRequestHandlerFactory with specified request mapping", () => {
      const newFactory = factory.withRequestMapping(UserModel, UserDTO);

      expect(newFactory).toBeInstanceOf(AcquireRequestHandlerFactory);
      expect(newFactory["requestModel"]).toEqual(UserModel);
      expect(newFactory["requestDTO"]).toEqual(UserDTO);
    });
  });

  describe("function: request", () => {
    it("should return a generic request handler", () => {
      const handler = factory.request({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
    });

    it("should call the request handler with the response DTO and Model classes", () => {
      const handler = factory
        .withResponseMapping(UserModel, UserDTO)
        .request({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        {},
        mockGetConfig,
        UserModel,
        UserDTO,
        undefined,
        undefined
      );
    });

    it("should call the request handler with the request DTO and Model classes", () => {
      const handler = factory
        .withRequestMapping(UserModel, UserDTO)
        .request({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        {},
        mockGetConfig,
        undefined,
        undefined,
        UserModel,
        UserDTO
      );
    });
  });

  describe("function: get", () => {
    it("should return a GET request handler", () => {
      const handler = factory.get({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    it("should return a GET request handler while allowing additional request config to be set", () => {
      const path = ({ id }: { id: number }): string => `/users/${id}`;
      const handler = factory.get<{ id: number }>({ path });

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          path
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: post", () => {
    it("should return a POST request handler", () => {
      const handler = factory.post({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: put", () => {
    it("should return a PUT request handler", () => {
      const handler = factory.put({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PUT"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: patch", () => {
    it("should return a PATCH request handler", () => {
      const handler = factory.patch({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PATCH"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: delete", () => {
    it("should return a DELETE request handler", () => {
      const handler = factory.delete({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "DELETE"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: head", () => {
    it("should return a HEAD request handler", () => {
      const handler = factory.head({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "HEAD"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: options", () => {
    it("should return a OPTIONS request handler", () => {
      const handler = factory.options({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "OPTIONS"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: purge", () => {
    it("should return a PURGE request handler", () => {
      const handler = factory.purge({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PURGE"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: link", () => {
    it("should return a LINK request handler", () => {
      const handler = factory.link({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "LINK"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("function: unlink", () => {
    it("should return a UNLINK request handler", () => {
      const handler = factory.unlink({});

      expect(handler).toBeInstanceOf(AcquireRequestHandler);
      expect(AcquireRequestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "UNLINK"
        }),
        mockGetConfig,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });
});
