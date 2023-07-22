import AcquireMockCache from "@/classes/AcquireMockCache.class";
import { AcquireRequestHandler } from "@/classes/AcquireRequestHandler.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import isPlainObject from "@tests/testing-utils/isPlainObject.function";
import axios, { AxiosError, AxiosResponse } from "axios";
import MockAdapter from "axios-mock-adapter";
import { Chance } from "chance";
import { Expose } from "class-transformer";

describe("class: AcquireRequestHandler", () => {
  const axiosInstance = axios.create();
  const mockAxios = new MockAdapter(axiosInstance);
  const chance = new Chance();

  afterEach(() => {
    mockAxios.reset();
  });

  describe("execution", () => {
    class UserDTO {
      id: number;
      name: string;
      age: number;
    }

    class UserModel {
      @Expose() id: number;
      @Expose() name: string;
      @Expose() age: number;
    }

    class CreateUserDTO {
      @Expose() name: string;
      @Expose() age: number;

      isCreateUserDTO = true;
    }

    class CreateUserModel {
      name: string;
      age: number;
    }

    it("should call axios with the correct value arguments", async () => {
      const getUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/1",
          headers: { Authorization: "Bearer token" }
        },
        () => ({
          axiosInstance
        })
      );

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          id: 1,
          name: chance.name(),
          age: chance.age()
        }
      };

      mockAxios
        .onGet("https://api.example.com/user/1")
        .reply(200, mockResponse.data);

      const response = await getUser();

      expect(response.response.data).toEqual(mockResponse.data);
      expect(response.response.config.url).toEqual(
        "https://api.example.com/user/1"
      );
      expect(response.response.config.headers.Authorization).toEqual(
        "Bearer token"
      );
    });

    it("should call axios with the correct function arguments", async () => {
      const getUser = new AcquireRequestHandler<{ userId: number }>(
        {
          url: ({ userId }): string => `https://api.example.com/user/${userId}`,
          headers: { Authorization: "Bearer token" }
        },
        () => ({
          axiosInstance
        })
      );

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          id: 10,
          name: chance.name(),
          age: chance.age()
        }
      };

      mockAxios
        .onGet("https://api.example.com/user/10")
        .reply(200, mockResponse.data);

      const response = await getUser({ userId: 10 });

      expect(response.response.data).toEqual(mockResponse.data);
      expect(response.response.config.url).toEqual(
        "https://api.example.com/user/10"
      );
      expect(response.response.config.headers.Authorization).toEqual(
        "Bearer token"
      );
    });

    it("should transform the response data into a DTO and Model class instance", async () => {
      const getUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/1"
        },
        () => ({
          axiosInstance
        }),
        UserModel,
        UserDTO
      );

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          id: 1,
          name: chance.name(),
          age: chance.age()
        }
      };

      mockAxios
        .onGet("https://api.example.com/user/1")
        .reply(200, mockResponse.data);

      const response = await getUser();

      expect(response.dto).toBeInstanceOf(UserDTO);
      expect(response.model).toBeInstanceOf(UserModel);
    });

    it("should transform the response data into a DTO and Model class instance array", async () => {
      const getUsers = new AcquireRequestHandler(
        {
          url: "https://api.example.com/users"
        },
        () => ({
          axiosInstance
        }),
        [UserModel],
        [UserDTO]
      );

      const mockResponse: Partial<AxiosResponse> = {
        data: Array.from({ length: 10 }).map(() => ({
          id: chance.natural(),
          name: chance.name(),
          age: chance.age()
        }))
      };

      mockAxios
        .onGet("https://api.example.com/users")
        .reply(200, mockResponse.data);

      const response = await getUsers();

      expect(response.dto.length).toEqual(10);
      response.dto.forEach((dto) => {
        expect(dto).toBeInstanceOf(UserDTO);
      });

      expect(response.model.length).toEqual(10);
      response.model.forEach((model) => {
        expect(model).toBeInstanceOf(UserModel);
      });
    });

    it("should forward data without transforming it if request Model is provided, but no request DTO", async () => {
      const requestSpy = jest
        .spyOn(axiosInstance, "request")
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const createUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/1",
          method: "POST"
        },
        () => ({
          axiosInstance
        }),
        UserModel,
        UserDTO,
        CreateUserModel
      );

      const userData = new CreateUserModel();
      userData.age = chance.age();
      userData.name = chance.name();

      await createUser({
        data: userData
      });

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            age: userData.age,
            name: userData.name
          }
        })
      );

      requestSpy.mockRestore();
    });

    it("should transform the data into a DTO if a request DTO is provided", async () => {
      const requestSpy = jest
        .spyOn(axiosInstance, "request")
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const createUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/1",
          method: "POST"
        },
        () => ({
          axiosInstance
        }),
        UserModel,
        UserDTO,
        CreateUserModel,
        CreateUserDTO
      );

      const userData = new CreateUserModel();
      userData.age = chance.age();
      userData.name = chance.name();

      await createUser({
        data: userData
      });

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            age: userData.age,
            name: userData.name,
            isCreateUserDTO: true
          }
        })
      );

      requestSpy.mockRestore();
    });

    it("should execute the right middlewares", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const getUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/10"
        },
        () => ({
          axiosInstance
        })
      );

      const middlewareExecution = jest.fn();
      const middlewareMocking = jest.fn();
      const middlewareBoth = jest.fn();

      getUser
        .useOnExecution(middlewareExecution)
        .useOnMocking(middlewareMocking)
        .use(middlewareBoth);

      await getUser();

      expect(middlewareExecution).toHaveBeenCalled();
      expect(middlewareMocking).not.toHaveBeenCalled();
      expect(middlewareBoth).toHaveBeenCalled();
    });

    it("should allow errors to be handled by middleware", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject(new AxiosError("Not found"))
        );

      const mockInterceptor = jest.fn();

      const getUser = new AcquireRequestHandler(
        {
          url: "http://api.example.com/user/10"
        },
        () => ({
          axiosInstance
        })
      );

      getUser.useOnExecution(mockInterceptor);

      await expect(getUser()).rejects.toThrow();

      expect(mockInterceptor).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: "Not found"
          })
        })
      );
    });
  });

  describe("mocking", () => {
    const fakeName = chance.name();
    const fakeAge = chance.age();
    const fakeId = chance.natural();
    class UserDTO {
      @Mock(fakeId) id: number;
      @Mock(fakeName) name: string;
      @Mock(fakeAge) age: number;
    }

    class UserModel {
      @Expose() id: number;
      @Expose() name: string;
      @Expose() age: number;
    }

    it("should call mock and not execute when the callable instance is called with mock", async () => {
      const executeSpy = jest
        .spyOn(AcquireRequestHandler.prototype, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const mockSpy = jest
        .spyOn(AcquireRequestHandler.prototype, "mock")
        .mockImplementation(() => Promise.resolve({} as any));

      const getUsers = new AcquireRequestHandler(
        {
          url: "https://api.example.com/users"
        },
        () => ({
          axiosInstance
        })
      );

      await getUsers.mock();

      expect(executeSpy).not.toHaveBeenCalled();
      expect(mockSpy).toHaveBeenCalled();

      executeSpy.mockRestore();
      mockSpy.mockRestore();
    });

    it("should call mock and not execute when mocking is enabled globally", async () => {
      const executeSpy = jest
        .spyOn(AcquireRequestHandler.prototype, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const mockSpy = jest
        .spyOn(AcquireRequestHandler.prototype, "mock")
        .mockImplementation(() => Promise.resolve({} as any));

      const getUsers = new AcquireRequestHandler(
        {
          url: "https://api.example.com/users"
        },
        () => ({
          axiosInstance,
          isMockingEnabled: true
        })
      );

      await getUsers();

      expect(executeSpy).not.toHaveBeenCalled();
      expect(mockSpy).toHaveBeenCalled();

      executeSpy.mockRestore();
      mockSpy.mockRestore();
    });

    it("should mock DTO and Model when a DTO class is provided", async () => {
      const getUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/10"
        },
        () => ({
          axiosInstance
        }),
        UserModel,
        UserDTO
      );

      const response = await getUser.mock();

      expect(isPlainObject(response.response.data)).toEqual(true);
      expect(isPlainObject(response.dto)).toEqual(false);
      expect(isPlainObject(response.model)).toEqual(false);

      expect(response.dto).toBeInstanceOf(UserDTO);
      expect(response.dto.id).toEqual(fakeId);
      expect(response.dto.name).toEqual(fakeName);
      expect(response.dto.age).toEqual(fakeAge);

      expect(response.model).toBeInstanceOf(UserModel);
      expect(response.model.id).toEqual(fakeId);
      expect(response.model.name).toEqual(fakeName);
      expect(response.model.age).toEqual(fakeAge);
    });

    it("should mock DTO and Model arrays when a DTO class array is provided", async () => {
      const getUsers = new AcquireRequestHandler(
        {
          url: "https://api.example.com/users"
        },
        () => ({
          axiosInstance
        }),
        [UserModel],
        [UserDTO]
      );

      const response = await getUsers.mock();

      const responseWithMockCount = await getUsers.mock(20);

      expect(response.dto.length).toEqual(10); // The default value of mockCount is 10
      response.dto.forEach((dto) => {
        expect(dto).toBeInstanceOf(UserDTO);
      });

      expect(response.model.length).toEqual(10);
      response.model.forEach((model) => {
        expect(model).toBeInstanceOf(UserModel);
      });

      expect(responseWithMockCount.dto.length).toEqual(20);
      responseWithMockCount.dto.forEach((dto) => {
        expect(dto).toBeInstanceOf(UserDTO);
      });

      expect(responseWithMockCount.model.length).toEqual(20);
      responseWithMockCount.model.forEach((model) => {
        expect(model).toBeInstanceOf(UserModel);
      });
    });

    it("should execute the right middlewares", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const getUser = new AcquireRequestHandler(
        {
          url: "https://api.example.com/user/10"
        },
        () => ({
          axiosInstance
        })
      );

      const middlewareExecution = jest.fn();
      const middlewareMocking = jest.fn();
      const middlewareBoth = jest.fn();

      getUser
        .useOnExecution(middlewareExecution)
        .useOnMocking(middlewareMocking)
        .use(middlewareBoth);

      await getUser.mock();

      expect(middlewareExecution).not.toHaveBeenCalled();
      expect(middlewareMocking).toHaveBeenCalled();
      expect(middlewareBoth).toHaveBeenCalled();
    });

    it("should call middleware with the right context arguments", async () => {
      const mockInterceptor = jest.fn();
      const mockCache = new AcquireMockCache();

      const getUser = new AcquireRequestHandler<{ userId?: number }>(
        {
          url: ({ userId }): string => `https://api.example.com/user/${userId}`,
          headers: {
            Accept: "application/json"
          }
        },
        () => ({
          axiosInstance,
          mockCache
        }),
        UserModel,
        UserDTO
      );

      getUser.useOnMocking(mockInterceptor);

      await getUser.mock({ userId: 10 });

      expect(mockInterceptor).toHaveBeenCalledWith(
        expect.objectContaining({
          requestConfig: expect.objectContaining({
            url: "https://api.example.com/user/10",
            headers: {
              Accept: "application/json"
            }
          }),
          type: "mocking",
          method: "GET",
          responseModel: UserModel,
          responseDTO: UserDTO,
          callArgs: { userId: 10 },
          mockCache
        })
      );
    });

    // it("should forward the context parameters to the Mock decorator", async () => {
    //   class MockTestDTO {
    //     @Mock((ctx) => ctx?.callArgs?.id ?? 10) id: number;
    //   }

    //   const getUser = new AcquireRequestHandler<
    //     { id: number },
    //     typeof MockTestDTO
    //   >(() => ({
    //     axiosInstance
    //   }));

    //   const response = await getUser.mock(
    //     {
    //       request: {
    //         url: (args) => `https://example.com/test/${args?.id}`,
    //         headers: {
    //           Accept: "application/json"
    //         }
    //       },
    //       responseMapping: {
    //         DTO: MockTestDTO
    //       }
    //     },
    //     { id: 5 }
    //   );

    //   expect(response.dto.id).toEqual(5);
    // });
  });
});
