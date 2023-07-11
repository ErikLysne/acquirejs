import { RequestMethodType } from "@/constants/RequestMethod.const";
import generateMock from "@/functions/generateMock.function";
import resolveValueOrCallback from "@/functions/resolveValueOrCallback.function";
import transform from "@/functions/transform.function";
import unwrapClassOrClassArray from "@/functions/unwrapClassArray.function";
import isAcquireMiddlewareClass from "@/guards/isAcquireMiddleware.guard";
import { AcquireArgs } from "@/interfaces/AcquireArgs.interface";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import {
  AcquireMiddleware,
  AcquireMiddlewareFn,
  AcquireMiddlewareWithOrder
} from "@/interfaces/AcquireMiddleware.interface";
import { AcquireRequestOptions } from "@/interfaces/AcquireRequestOptions.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";
import { InstanceOrInstanceArray } from "@/interfaces/InstanceOrInstanceArray.interface";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { instanceToPlain } from "class-transformer";
import AcquireMockCache from "./AcquireMockCache.class";
import { CallableInstance } from "./CallableInstance.class";

export interface AcquireRequestExecutor<
  TCallArgs extends AcquireCallArgs = object,
  TResponseDTO extends ClassOrClassArray = any,
  TResponseModel extends ClassOrClassArray = any,
  TRequestDTO extends ClassOrClassArray = any,
  TRequestModel extends ClassOrClassArray = any
> {
  (
    acquireArgs: AcquireArgs<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel,
      false
    >,
    callArgs?: TCallArgs & { data?: InstanceOrInstanceArray<TRequestModel> }
  ): Promise<AcquireResult<TResponseDTO, TResponseModel>>;
}

export type AcquireRequestExecutorGetConfig = () => {
  axiosInstance: AxiosInstance;
  executionMiddlewares?: AcquireMiddlewareWithOrder[];
  mockingMiddlewares?: AcquireMiddlewareWithOrder[];
  mockCache?: AcquireMockCache;
  isMockingEnabled?: boolean;
};

export interface AcquireResult<
  TResponseDTO extends ClassOrClassArray | undefined,
  TResponseModel extends ClassOrClassArray | undefined
> {
  response: AxiosResponse;
  dto: InstanceOrInstanceArray<TResponseDTO>;
  model: InstanceOrInstanceArray<TResponseModel>;
}

export class AcquireRequestExecutor<
  TCallArgs extends AcquireCallArgs = object,
  TResponseDTO extends ClassOrClassArray = any,
  TResponseModel extends ClassOrClassArray = any,
  TRequestDTO extends ClassOrClassArray = any,
  TRequestModel extends ClassOrClassArray = any
> extends CallableInstance {
  private __isAcquireRequestExecutorInstance = true;
  private executionMiddlewares: AcquireMiddlewareWithOrder[] = [];
  private mockingMiddlewares: AcquireMiddlewareWithOrder[] = [];

  constructor(private getConfig: AcquireRequestExecutorGetConfig) {
    super((...args: any[]) => {
      if (getConfig().isMockingEnabled) {
        return (this.mock as any)(...args);
      }
      return (this.execute as any)(...args);
    });
    this.mock = this.mock.bind(this);
  }

  static isAcquireRequestExecutorInstance(
    instance: unknown
  ): instance is AcquireRequestExecutor {
    return !!(instance as AcquireRequestExecutor)
      ?.__isAcquireRequestExecutorInstance;
  }

  public use(middleware: AcquireMiddleware, order = 0): this {
    this.executionMiddlewares.push([middleware, order]);
    this.mockingMiddlewares.push([middleware, order]);
    return this;
  }

  public useOnExecution(middleware: AcquireMiddleware, order = 0): this {
    this.executionMiddlewares.push([middleware, order]);
    return this;
  }

  public useOnMocking(middleware: AcquireMiddleware, order = 0): this {
    this.mockingMiddlewares.push([middleware, order]);
    return this;
  }

  public clearMiddlewares(): this {
    this.executionMiddlewares = [];
    this.mockingMiddlewares = [];
    return this;
  }

  public async execute(
    acquireArgs: AcquireArgs<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel,
      false
    >,
    callArgs?: TCallArgs & { data?: InstanceOrInstanceArray<TRequestModel> }
  ): Promise<AcquireResult<TResponseDTO, TResponseModel>> {
    const {
      request,
      responseMapping = {},
      requestMapping = {},
      axiosConfig = {}
    } = acquireArgs;
    const { axiosInstance, mockCache, isMockingEnabled } = this.getConfig();

    if (isMockingEnabled) {
      return this.mock(acquireArgs, callArgs);
    }

    let requestData = callArgs?.data;
    if (requestMapping.DTO && callArgs?.data) {
      const plainData = instanceToPlain(callArgs.data);

      requestData = transform(plainData, requestMapping.DTO, {
        excludeExtraneousValues: true
      });
    }

    const { request: _request, ...rest } = acquireArgs ?? {};
    const requestConfig = (
      request ? this.resolveRequestConfig(request, callArgs, axiosConfig) : {}
    ) as AxiosRequestConfig & { method: RequestMethodType };

    let response = null;

    function preventMockDataGeneration(): void {}
    function mockDataGenerationPrevented(): boolean {
      return false;
    }

    const context: AcquireContext<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    > = {
      acquireArgs: {
        ...rest,
        request: requestConfig
      },
      type: "execution",
      method: requestConfig.method,
      callArgs,
      mockCache,
      preventMockDataGeneration,
      mockDataGenerationPrevented,
      response: {} as AxiosResponse // The response context is handled below
    };

    try {
      response = await axiosInstance.request({
        ...requestConfig,
        data: requestData
      });

      context.response = response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        context.error = error;
        if (error.response) {
          context.response = error.response;
        }
      }
      throw error;
    } finally {
      for (const middleware of this.getMiddlewares("execution")) {
        middleware(context);
      }
    }

    const dto = transform(response.data, responseMapping.DTO);
    const model = transform(response.data, responseMapping.Model, {
      excludeExtraneousValues: true
    });

    return {
      response,
      dto,
      model
    };
  }

  public async mock(
    acquireArgs: AcquireArgs<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel,
      false
    >,
    callArgs?: TCallArgs & {
      data?: InstanceOrInstanceArray<TRequestModel>;
      $count?: number;
    }
  ): Promise<AcquireResult<TResponseDTO, TResponseModel>> {
    const {
      request,
      responseMapping = {},
      requestMapping = {},
      axiosConfig = {}
    } = acquireArgs;
    const { axiosInstance, mockCache } = this.getConfig();

    const requestConfig = (
      request ? this.resolveRequestConfig(request, callArgs, axiosConfig) : {}
    ) as AxiosRequestConfig & { method: RequestMethodType };

    let requestData = callArgs?.data;
    if (requestMapping.DTO && callArgs?.data) {
      const plainData = instanceToPlain(callArgs.data);

      requestData = transform(plainData, requestMapping.DTO, {
        excludeExtraneousValues: true
      });
    }

    function mergeConfigObjects(
      ...args: object[]
    ): Partial<AxiosRequestConfig> {
      const config: Partial<AxiosRequestConfig> = {};

      args.forEach((arg) => {
        for (const _key in arg) {
          const key = _key as keyof typeof arg;
          if (arg[key] != null) {
            config[key] = arg[key];
          }
        }
      });

      return config;
    }

    const mockResponse = {
      config: mergeConfigObjects(axiosInstance.defaults, requestConfig, {
        data: requestData
      }),
      data: undefined,
      status: 200,
      statusText: "OK"
    } as Partial<AxiosResponse>;

    const { request: _request, ...rest } = acquireArgs ?? {};

    let isMockDataGenerationPrevented = false;

    function preventMockDataGeneration(): void {
      isMockDataGenerationPrevented = true;
    }
    function mockDataGenerationPrevented(): boolean {
      return isMockDataGenerationPrevented;
    }

    const context: AcquireContext<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    > = {
      acquireArgs: {
        ...rest,
        request: requestConfig
      },
      type: "mocking",
      method: requestConfig.method,
      callArgs,
      mockCache,
      mockDataGenerationPrevented,
      preventMockDataGeneration,
      response: mockResponse as AxiosResponse
    };

    for (const middleware of this.getMiddlewares("mocking")) {
      try {
        middleware(context);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          context.error = error;
          if (error.response) {
            context.response = error.response;
          }
        }
      }
    }

    if (context.error) {
      throw context.error;
    }

    if (
      !isMockDataGenerationPrevented &&
      !context.response.data &&
      responseMapping.DTO
    ) {
      const { ClassUnwrapped: DTOUnwrapped, isClassArray: isDTOArray } =
        unwrapClassOrClassArray(responseMapping.DTO);

      const mockResult = await (isDTOArray
        ? generateMock(DTOUnwrapped, callArgs?.$count ?? 10, mockCache, context)
        : generateMock(DTOUnwrapped, undefined, mockCache, context));

      mockResponse.data = instanceToPlain(mockResult);
    }

    const mockDto = transform(mockResponse?.data, responseMapping.DTO);
    const mockModel = transform(mockResponse?.data, responseMapping.Model, {
      excludeExtraneousValues: true
    });

    return {
      response: mockResponse as AxiosResponse,
      dto: mockDto,
      model: mockModel
    };
  }

  private resolveRequestConfig(
    request: AcquireRequestOptions<any, false>,
    callArgs: any,
    axiosConfig?: AxiosRequestConfig<any>
  ): AxiosRequestConfig {
    const {
      method = "GET",
      url,
      path,
      baseURL,
      headers,
      params,
      responseEncoding,
      responseType,
      timeout,
      timeoutErrorMessage
    } = request;

    const methodValue = resolveValueOrCallback(method, callArgs);
    const baseURLValue = resolveValueOrCallback(baseURL, callArgs);
    const headersValue = resolveValueOrCallback(headers, callArgs);
    const paramsValue = resolveValueOrCallback(params, callArgs);
    const responseEncodingValue = resolveValueOrCallback(
      responseEncoding,
      callArgs
    );
    const responseTypeValue = resolveValueOrCallback(responseType, callArgs);
    const timeoutValue = resolveValueOrCallback(timeout, callArgs);
    const timeoutErrorMessageValue = resolveValueOrCallback(
      timeoutErrorMessage,
      callArgs
    );
    const urlValue = resolveValueOrCallback(url, callArgs);
    const pathValue = resolveValueOrCallback(path, callArgs);

    return {
      method: methodValue,
      baseURL: baseURLValue,
      headers: headersValue,
      params: paramsValue,
      responseEncoding: responseEncodingValue,
      responseType: responseTypeValue,
      timeout: timeoutValue,
      timeoutErrorMessage: timeoutErrorMessageValue,
      url: urlValue ?? pathValue,
      ...axiosConfig
    };
  }

  private resolveMiddlewares(
    orderedMiddlewares: AcquireMiddlewareWithOrder[]
  ): AcquireMiddlewareFn[] {
    const orderedMiddlewareFns: [
      middlewareFn: AcquireMiddlewareFn,
      order: number
    ][] = [];

    for (const orderedMiddleware of orderedMiddlewares) {
      const [middleware, order] = orderedMiddleware;
      if (isAcquireMiddlewareClass(middleware)) {
        orderedMiddlewareFns.push([
          middleware.handle,
          middleware.order ?? order
        ]);
      } else {
        orderedMiddlewareFns.push([middleware, order]);
      }
    }

    return orderedMiddlewareFns
      .sort((a, b) => a[1] - b[1])
      .map(([middlewareFn]) => middlewareFn);
  }

  private getMiddlewares(mode: AcquireContext["type"]): AcquireMiddlewareFn[] {
    if (mode === "execution") {
      return this.resolveMiddlewares([
        ...(this.getConfig().executionMiddlewares ?? []),
        ...this.executionMiddlewares
      ]);
    }

    return this.resolveMiddlewares([
      ...(this.getConfig().mockingMiddlewares ?? []),
      ...this.mockingMiddlewares
    ]);
  }
}
