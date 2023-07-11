import AcquireMockCache from "@/classes/AcquireMockCache.class";
import { AcquireRequestExecutor } from "@/classes/AcquireRequestExecutor.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import isPlainObject from "@tests/testing-utils/isPlainObject.function";
import axios, { AxiosError, AxiosResponse } from "axios";
import MockAdapter from "axios-mock-adapter";
import { Chance } from "chance";
import { Expose } from "class-transformer";

describe("class: AcquireRequestExecutor", () => {
  const axiosInstance = axios.create();
  const mockAxios = new MockAdapter(axiosInstance);
  const chance = new Chance();

  afterEach(() => {
    mockAxios.reset();
  });

  describe("executing callable instance", () => {
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
    }

    class CreateUserModel {
      name: string;
      age: number;
    }

    it("should call axios with the correct value arguments", async () => {
      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          id: 1,
          name: chance.name(),
          age: chance.age()
        }
      };

      mockAxios
        .onGet("https://example.com/user/1")
        .reply(200, mockResponse.data);

      const response = await getUser({
        request: {
          url: "https://example.com/user/1",
          headers: { Authorization: "Bearer token" }
        }
      });

      expect(response.response.data).toEqual(mockResponse.data);
      expect(response.response.config.url).toEqual(
        "https://example.com/user/1"
      );
      expect(response.response.config.headers.Authorization).toEqual(
        "Bearer token"
      );
    });

    it("should call axios with the correct function arguments", async () => {
      const getUser = new AcquireRequestExecutor<{ userId: number }>(() => ({
        axiosInstance
      }));

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          id: 10,
          name: chance.name(),
          age: chance.age()
        }
      };

      mockAxios
        .onGet("https://example.com/user/10")
        .reply(200, mockResponse.data);

      const response = await getUser(
        {
          request: {
            url: (args) => `https://example.com/user/${args?.userId}`,
            headers: { Authorization: "Bearer token" }
          }
        },
        { userId: 10 }
      );

      expect(response.response.data).toEqual(mockResponse.data);
      expect(response.response.config.url).toEqual(
        "https://example.com/user/10"
      );
      expect(response.response.config.headers.Authorization).toEqual(
        "Bearer token"
      );
    });

    it("should transform the response data into a DTO and Model class instance", async () => {
      const getUser = new AcquireRequestExecutor<
        any,
        typeof UserDTO,
        typeof UserModel
      >(() => ({
        axiosInstance
      }));

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          id: 1,
          name: chance.name(),
          age: chance.age()
        }
      };

      mockAxios
        .onGet("https://example.com/user/1")
        .reply(200, mockResponse.data);

      const response = await getUser({
        request: {
          url: "https://example.com/user/1"
        },
        responseMapping: {
          DTO: UserDTO,
          Model: UserModel
        }
      });

      expect(response.dto).toBeInstanceOf(UserDTO);
      expect(response.model).toBeInstanceOf(UserModel);
    });

    it("should transform the response data into a DTO and Model class instance array", async () => {
      const getUsers = new AcquireRequestExecutor<
        any,
        [typeof UserDTO],
        [typeof UserModel]
      >(() => ({
        axiosInstance
      }));

      const mockResponse: Partial<AxiosResponse> = {
        data: Array.from({ length: 10 }).map(() => ({
          id: chance.natural(),
          name: chance.name(),
          age: chance.age()
        }))
      };

      mockAxios
        .onGet("https://example.com/users")
        .reply(200, mockResponse.data);

      const response = await getUsers({
        request: {
          url: `https://example.com/users`
        },
        responseMapping: {
          DTO: [UserDTO],
          Model: [UserModel]
        }
      });

      expect(response.dto.length).toEqual(10);
      response.dto.forEach((dto) => {
        expect(dto).toBeInstanceOf(UserDTO);
      });

      expect(response.model.length).toEqual(10);
      response.model.forEach((model) => {
        expect(model).toBeInstanceOf(UserModel);
      });
    });

    it("should forward data if no request DTO is provided", async () => {
      const requestSpy = jest
        .spyOn(axiosInstance, "request")
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const createUser = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      const userFormData = new CreateUserModel();
      userFormData.age = chance.age();
      userFormData.name = chance.name();

      await createUser(
        {
          request: {
            url: "https://example.com/user/1",
            method: "POST"
          }
        },
        {
          data: userFormData
        }
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            age: userFormData.age,
            name: userFormData.name
          }
        })
      );

      requestSpy.mockRestore();
    });

    it("should transform the request Model instance into a DTO class instance", async () => {
      const requestSpy = jest
        .spyOn(axiosInstance, "request")
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const createUser = new AcquireRequestExecutor<
        any,
        any,
        any,
        typeof CreateUserDTO,
        typeof CreateUserModel
      >(() => ({
        axiosInstance
      }));

      const userFormData = new CreateUserModel();
      userFormData.age = chance.age();
      userFormData.name = chance.name();

      await createUser(
        {
          request: {
            url: "https://example.com/user/1",
            method: "POST"
          },
          requestMapping: {
            DTO: CreateUserDTO,
            Model: CreateUserModel
          }
        },
        {
          data: userFormData
        }
      );

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            age: userFormData.age,
            name: userFormData.name
          }
        })
      );

      requestSpy.mockRestore();
    });

    it("should execute the right middlewares from the instance", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      const middlewareExecution = jest.fn();
      const middlewareMocking = jest.fn();
      const middlewareBoth = jest.fn();

      getUser
        .useOnExecution(middlewareExecution)
        .useOnMocking(middlewareMocking)
        .use(middlewareBoth);

      await getUser({
        request: {
          url: "https://example.com/user/10"
        }
      });

      expect(middlewareExecution).toHaveBeenCalled();
      expect(middlewareMocking).not.toHaveBeenCalled();
      expect(middlewareBoth).toHaveBeenCalled();
    });

    it("should execute the right middlewares from the config", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const middlewareExecution = jest.fn();
      const middlewareMocking = jest.fn();
      const middlewareBoth = jest.fn();

      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance,
        executionMiddlewares: [
          [middlewareExecution, 0],
          [middlewareBoth, 0]
        ],
        mockingMiddlewares: [
          [middlewareMocking, 0],
          [middlewareBoth, 0]
        ]
      }));

      await getUser({
        request: {
          url: "https://example.com/user/10"
        }
      });

      expect(middlewareExecution).toHaveBeenCalled();
      expect(middlewareMocking).not.toHaveBeenCalled();
      expect(middlewareBoth).toHaveBeenCalled();
    });

    it("should execute the right middlewares from both the instance and config", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const configMiddlewareExecution = jest.fn();
      const configMiddlewareMocking = jest.fn();
      const configMiddlewareBoth = jest.fn();

      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance,
        executionMiddlewares: [
          [configMiddlewareExecution, 0],
          [configMiddlewareBoth, 0]
        ],
        mockingMiddlewares: [
          [configMiddlewareMocking, 0],
          [configMiddlewareBoth, 0]
        ]
      }));

      const instanceMiddlewareExecution = jest.fn();
      const instanceMiddlewareMocking = jest.fn();
      const instanceMiddlewareBoth = jest.fn();

      getUser
        .useOnExecution(instanceMiddlewareExecution)
        .useOnMocking(instanceMiddlewareMocking)
        .use(instanceMiddlewareBoth);

      await getUser({
        request: {
          url: "https://example.com/user/10"
        }
      });

      expect(configMiddlewareExecution).toHaveBeenCalled();
      expect(configMiddlewareMocking).not.toHaveBeenCalled();
      expect(configMiddlewareBoth).toHaveBeenCalled();
      expect(instanceMiddlewareExecution).toHaveBeenCalled();
      expect(instanceMiddlewareMocking).not.toHaveBeenCalled();
      expect(instanceMiddlewareBoth).toHaveBeenCalled();
    });

    it("should call middleware with the right context arguments", async () => {
      axiosInstance.request = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            id: 10,
            name: "Christian Bale",
            age: 49
          }
        })
      );

      const mockInterceptor = jest.fn();
      const mockCache = new AcquireMockCache();

      const getUser = new AcquireRequestExecutor<
        { userId: number },
        typeof UserDTO,
        typeof UserModel
      >(() => ({
        axiosInstance,
        mockCache
      }));

      getUser.useOnExecution(mockInterceptor);

      const url = (args: { userId?: number } | undefined): string =>
        `https://example.com/user/${args?.userId}`;

      await getUser(
        {
          request: {
            url,
            headers: {
              Accept: "application/json"
            }
          },
          responseMapping: {
            DTO: UserDTO,
            Model: UserModel
          }
        },
        { userId: 10 }
      );

      expect(mockInterceptor).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({
            data: {
              id: 10,
              name: "Christian Bale",
              age: 49
            }
          }),
          type: "execution",
          method: "GET",
          acquireArgs: expect.objectContaining({
            responseMapping: {
              DTO: UserDTO,
              Model: UserModel
            },
            request: expect.objectContaining({
              headers: {
                Accept: "application/json"
              },
              url: "https://example.com/user/10"
            })
          }),
          callArgs: {
            userId: 10
          },
          mockCache
        })
      );
    });

    it.todo("should execute middleware in the correct order");

    it("should allow errors to be handled by middleware", async () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject(new AxiosError("Not found"))
        );

      const mockInterceptor = jest.fn();

      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      getUser.useOnExecution(mockInterceptor);

      await expect(
        getUser({
          request: {
            url: "http://example.com/user/10"
          },
          responseMapping: {
            DTO: UserDTO,
            Model: UserModel
          }
        })
      ).rejects.toThrow();

      expect(mockInterceptor).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: "Not found"
          })
        })
      );
    });
  });

  describe("mocking callable instance", () => {
    class UserDTO {
      @Mock(10) id: number;
      @Mock("Christian Bale") name: string;
      @Mock(49) age: number;
    }

    class UserModel {
      @Expose() id: number;
      @Expose() name: string;
      @Expose() age: number;
    }

    it("should call mock and not execute when the callable instance is called with mock", async () => {
      const getUsers = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      const executeSpy = jest
        .spyOn(getUsers, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const mockSpy = jest
        .spyOn(getUsers, "mock")
        .mockImplementation(() => Promise.resolve({} as any));

      await getUsers.mock({
        request: {
          url: "https://example.com/users"
        }
      });

      expect(executeSpy).not.toHaveBeenCalled();
      expect(mockSpy).toHaveBeenCalled();

      executeSpy.mockRestore();
      mockSpy.mockRestore();
    });

    it("should call mock and not execute when mocking is enabled", async () => {
      const getUsers = new AcquireRequestExecutor(() => ({
        axiosInstance,
        isMockingEnabled: true
      }));

      const executeSpy = jest
        .spyOn(getUsers, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const mockSpy = jest
        .spyOn(getUsers, "mock")
        .mockImplementation(() => Promise.resolve({} as any));

      await getUsers({
        request: {
          url: "https://example.com/users"
        }
      });

      expect(executeSpy).not.toHaveBeenCalled();
      expect(mockSpy).toHaveBeenCalled();

      executeSpy.mockRestore();
      mockSpy.mockRestore();
    });

    it("should mock DTO and Model when a DTO class is provided", async () => {
      const getUser = new AcquireRequestExecutor<
        any,
        typeof UserDTO,
        typeof UserModel
      >(() => ({
        axiosInstance
      }));

      const response = await getUser.mock({
        request: {
          url: "https://example.com/user/10"
        },
        responseMapping: {
          DTO: UserDTO,
          Model: UserModel
        }
      });

      expect(isPlainObject(response.response.data)).toEqual(true);
      expect(isPlainObject(response.dto)).toEqual(false);
      expect(isPlainObject(response.model)).toEqual(false);

      expect(response.dto).toBeInstanceOf(UserDTO);
      expect(response.dto.id).toEqual(10);
      expect(response.dto.name).toEqual("Christian Bale");
      expect(response.dto.age).toEqual(49);

      expect(response.model).toBeInstanceOf(UserModel);
      expect(response.model.id).toEqual(10);
      expect(response.model.name).toEqual("Christian Bale");
      expect(response.model.age).toEqual(49);
    });

    it("should mock DTO and Model arrays when a DTO class array is provided", async () => {
      const getUsers = new AcquireRequestExecutor<
        any,
        [typeof UserDTO],
        [typeof UserModel]
      >(() => ({
        axiosInstance
      }));

      const response = await getUsers.mock({
        request: {
          url: "https://example.com/users"
        },
        responseMapping: {
          DTO: [UserDTO],
          Model: [UserModel]
        }
      });

      const responseWithMockCount = await getUsers.mock(
        {
          request: {
            url: "https://example.com/users"
          },
          responseMapping: {
            DTO: [UserDTO],
            Model: [UserModel]
          }
        },
        { $count: 20 }
      );

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

    it("should execute the right middlewares from the instance", async () => {
      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      const middlewareExecution = jest.fn();
      const middlewareMocking = jest.fn();
      const middlewareBoth = jest.fn();

      getUser
        .useOnExecution(middlewareExecution)
        .useOnMocking(middlewareMocking)
        .use(middlewareBoth);

      await getUser.mock({
        request: {
          url: "https://example.com/user/10"
        }
      });

      expect(middlewareExecution).not.toHaveBeenCalled();
      expect(middlewareMocking).toHaveBeenCalled();
      expect(middlewareBoth).toHaveBeenCalled();
    });

    it("should execute the right middlewares from the config", async () => {
      const middlewareExecution = jest.fn();
      const middlewareMocking = jest.fn();
      const middlewareBoth = jest.fn();

      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance: axios,
        executionMiddlewares: [
          [middlewareExecution, 0],
          [middlewareBoth, 0]
        ],
        mockingMiddlewares: [
          [middlewareMocking, 0],
          [middlewareBoth, 0]
        ]
      }));

      await getUser.mock({
        request: {
          url: "https://example.com/user/10"
        }
      });

      expect(middlewareExecution).not.toHaveBeenCalled();
      expect(middlewareMocking).toHaveBeenCalled();
      expect(middlewareBoth).toHaveBeenCalled();
    });

    it("should execute the right middlewares from both the instance and config", async () => {
      const configMiddlewareExecution = jest.fn();
      const configMiddlewareMocking = jest.fn();
      const configMiddlewareBoth = jest.fn();

      const getUser = new AcquireRequestExecutor(() => ({
        axiosInstance,
        executionMiddlewares: [
          [configMiddlewareExecution, 0],
          [configMiddlewareBoth, 0]
        ],
        mockingMiddlewares: [
          [configMiddlewareMocking, 0],
          [configMiddlewareBoth, 0]
        ]
      }));

      const instanceMiddlewareExecution = jest.fn();
      const instanceMiddlewareMocking = jest.fn();
      const instanceMiddlewareBoth = jest.fn();

      getUser
        .useOnExecution(instanceMiddlewareExecution)
        .useOnMocking(instanceMiddlewareMocking)
        .use(instanceMiddlewareBoth);

      await getUser.mock({
        request: {
          url: "https://example.com/user/10"
        }
      });

      expect(configMiddlewareExecution).not.toHaveBeenCalled();
      expect(configMiddlewareMocking).toHaveBeenCalled();
      expect(configMiddlewareBoth).toHaveBeenCalled();
      expect(instanceMiddlewareExecution).not.toHaveBeenCalled();
      expect(instanceMiddlewareMocking).toHaveBeenCalled();
      expect(instanceMiddlewareBoth).toHaveBeenCalled();
    });

    it.todo("should execute middleware in the correct order");

    it("should call middleware with the right context arguments", async () => {
      const mockInterceptor = jest.fn();
      const mockCache = new AcquireMockCache();

      const getUser = new AcquireRequestExecutor<
        { userId: number },
        typeof UserDTO,
        typeof UserModel
      >(() => ({
        axiosInstance,
        mockCache
      }));

      getUser.useOnMocking(mockInterceptor);

      const url = (args: { userId?: number } | undefined): string =>
        `https://example.com/user/${args?.userId}`;

      await getUser.mock(
        {
          request: {
            url,
            headers: {
              Accept: "application/json"
            }
          },
          responseMapping: {
            DTO: UserDTO,
            Model: UserModel
          }
        },
        { userId: 10 }
      );

      expect(mockInterceptor).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({
            config: expect.objectContaining({
              headers: {
                Accept: "application/json"
              },
              url: "https://example.com/user/10"
            }),
            status: 200,
            statusText: "OK",
            data: {
              id: 10,
              name: "Christian Bale",
              age: 49
            }
          }),
          type: "mocking",
          method: "GET",
          acquireArgs: expect.objectContaining({
            responseMapping: {
              DTO: UserDTO,
              Model: UserModel
            },
            request: expect.objectContaining({
              headers: {
                Accept: "application/json"
              },
              url: "https://example.com/user/10"
            })
          }),
          callArgs: {
            userId: 10
          },
          mockCache
        })
      );
    });

    it("should forward the context parameters to the Mock decorator", async () => {
      class MockTestDTO {
        @Mock((ctx) => ctx?.callArgs?.id ?? 10) id: number;
      }

      const getUser = new AcquireRequestExecutor<
        { id: number },
        typeof MockTestDTO
      >(() => ({
        axiosInstance
      }));

      const response = await getUser.mock(
        {
          request: {
            url: (args) => `https://example.com/test/${args?.id}`,
            headers: {
              Accept: "application/json"
            }
          },
          responseMapping: {
            DTO: MockTestDTO
          }
        },
        { id: 5 }
      );

      expect(response.dto.id).toEqual(5);
    });
  });

  describe("function: isAcquireRequestExecutorInstance", () => {
    it("should return true when called with an instance of AcquireRequestExecutor", () => {
      const requestExecutor = new AcquireRequestExecutor(() => ({
        axiosInstance
      }));

      expect(
        AcquireRequestExecutor.isAcquireRequestExecutorInstance(requestExecutor)
      ).toBe(true);
    });

    it("should return false for any other input", () => {
      expect(AcquireRequestExecutor.isAcquireRequestExecutorInstance({})).toBe(
        false
      );
      expect(
        AcquireRequestExecutor.isAcquireRequestExecutorInstance(undefined)
      ).toBe(false);
      expect(
        AcquireRequestExecutor.isAcquireRequestExecutorInstance(null)
      ).toBe(false);
      expect(AcquireRequestExecutor.isAcquireRequestExecutorInstance(123)).toBe(
        false
      );
      expect(
        AcquireRequestExecutor.isAcquireRequestExecutorInstance("abc")
      ).toBe(false);
    });
  });
});
