import { AcquireRequestExecutor } from "@/classes/AcquireRequestExecutor.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import { AcquireMockCache } from "@/index";
import isPlainObject from "@tests/testing-utils/isPlainObject.function";
import axios, { AxiosResponse } from "axios";
import MockAdapter from "axios-mock-adapter";
import { Chance } from "chance";
import { Expose } from "class-transformer";

const mockAxios = new MockAdapter(axios);
const chance = new Chance();

describe("class: AcquireRequestExecutor", () => {
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
        axiosInstance: axios
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
        axiosInstance: axios
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
        axiosInstance: axios
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
        axiosInstance: axios
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
      const axiosInstance = axios.create();

      const postSpy = jest
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

      expect(postSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            age: userFormData.age,
            name: userFormData.name
          }
        })
      );

      postSpy.mockRestore();
    });

    it("should transform the request Model instance into a DTO class instance", async () => {
      const axiosInstance = axios.create();

      const postSpy = jest
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

      expect(postSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            age: userFormData.age,
            name: userFormData.name
          }
        })
      );

      postSpy.mockRestore();
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
        axiosInstance: axios
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
    });

    it("should call mock and not execute when mocking is enabled", async () => {
      const getUsers = new AcquireRequestExecutor(() => ({
        axiosInstance: axios,
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
    });

    it("should mock DTO and Model when a DTO class is provided", async () => {
      const getUser = new AcquireRequestExecutor<
        any,
        typeof UserDTO,
        typeof UserModel
      >(() => ({
        axiosInstance: axios
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
        axiosInstance: axios
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

    it("should allow the mockInterceptor to be set", () => {
      const mockInterceptor = jest.fn();

      const requestExecutor = new AcquireRequestExecutor(() => ({
        axiosInstance: axios
      }));

      requestExecutor.setMockInterceptor(mockInterceptor);

      expect(requestExecutor["mockInterceptor"]).toBeDefined();
    });

    it("should call the mockInterceptor with the right context arguments", async () => {
      const mockInterceptor = jest.fn();
      const mockCache = new AcquireMockCache();

      const getUser = new AcquireRequestExecutor<
        { userId: number },
        typeof UserDTO,
        typeof UserModel
      >(() => ({
        axiosInstance: axios,
        mockCache
      }));

      getUser.setMockInterceptor(mockInterceptor);

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
          mockResponse: expect.objectContaining({
            config: expect.objectContaining({
              headers: {
                Accept: "application/json"
              },
              url: "https://example.com/user/10"
            }),
            status: 200,
            statusText: "OK"
          }),
          args: expect.objectContaining({
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
        axiosInstance: axios
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
        axiosInstance: axios
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
