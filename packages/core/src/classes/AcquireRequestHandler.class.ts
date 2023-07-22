import { RequestMethodType } from "@/constants/RequestMethod.const";
import generateMock from "@/functions/generateMock.function";
import resolveValueOrCallback from "@/functions/resolveValueOrCallback.function";
import transform from "@/functions/transform.function";
import unwrapClassOrClassArray from "@/functions/unwrapClassArray.function";
import isClassOrClassArray from "@/guards/isClassOrClassArray.guard";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import { AcquireRequestConfig } from "@/interfaces/AcquireRequestConfig.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";
import { InstanceOrInstanceArray } from "@/interfaces/InstanceOrInstanceArray.interface";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { instanceToPlain } from "class-transformer";
import AcquireBase from "./AcquireBase.class";
import AcquireMockCache from "./AcquireMockCache.class";

export interface AcquireRequestHandlerConfig {
  axiosInstance: AxiosInstance;
  mockCache?: AcquireMockCache;
  isMockingEnabled?: boolean;
}
export interface AcquireResult<
  TResponseModel extends ClassOrClassArray | unknown,
  TResponseDTO extends ClassOrClassArray | unknown
> {
  response: AxiosResponse;
  dto: InstanceOrInstanceArray<TResponseDTO>;
  model: InstanceOrInstanceArray<TResponseModel>;
}

type RequestArgs<TRequestModel, TCallArgs> = [TRequestModel] extends [never]
  ? [TCallArgs] extends [never]
    ? []
    : [TCallArgs]
  : [TCallArgs] extends [never]
  ? [{ data: InstanceOrInstanceArray<TRequestModel> }]
  : [{ data: InstanceOrInstanceArray<TRequestModel> } & TCallArgs];

export interface AcquireRequestHandler<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> {
  (...args: RequestArgs<TRequestModel, TCallArgs>): Promise<
    AcquireResult<TResponseDTO, TResponseModel>
  >;
}

export class AcquireRequestHandler<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> extends AcquireBase<
  TCallArgs,
  TResponseModel,
  TResponseDTO,
  TRequestModel,
  TRequestDTO
> {
  constructor(
    private requestConfig: AcquireRequestConfig<TCallArgs>,
    private getConfig: () => AcquireRequestHandlerConfig,
    private responseModel?: TResponseModel,
    private responseDTO?: TResponseDTO,
    private requestModel?: TRequestModel,
    private requestDTO?: TRequestDTO
  ) {
    super();

    const proxy = new Proxy(this, {
      apply: function (
        target,
        _thisArg,
        argumentsList: any
      ): ReturnType<AcquireRequestHandler> {
        if (target.getConfig().isMockingEnabled) {
          return target.mock(...argumentsList);
        } else {
          return target.execute(...argumentsList);
        }
      }
    });

    return proxy;
  }

  private resolveRequestConfig(
    request: AcquireRequestConfig<any, false>,
    callArgs: any
  ): AxiosRequestConfig & { method: RequestMethodType } {
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
      timeoutErrorMessage,
      axiosConfig
    } = request;

    const { method: configMethod, ...config } = axiosConfig ?? {};

    const methodValue = resolveValueOrCallback(method ?? method, callArgs);
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
      ...config
    };
  }

  public async execute(
    ...args: RequestArgs<TRequestModel, TCallArgs>
  ): Promise<AcquireResult<TResponseModel, TResponseDTO>> {
    const { axiosInstance, mockCache, isMockingEnabled } = this.getConfig();
    const callArgs: AcquireCallArgs | undefined = args[0];

    if (isMockingEnabled) {
      return this.mock(...args);
    }

    let requestData = callArgs?.data;
    if (this.requestDTO && callArgs?.data) {
      const plainData = instanceToPlain(callArgs.data);

      requestData = transform(plainData, this.requestDTO, {
        excludeExtraneousValues: true
      });
    }

    const resolvedRequestConfig = this.resolveRequestConfig(
      this.requestConfig,
      callArgs
    );
    let response = null;

    const context: AcquireContext<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    > = {
      requestConfig: resolvedRequestConfig,
      responseModel: this.responseModel,
      responseDTO: this.responseDTO,
      requestDTO: this.requestDTO,
      requestModel: this.requestModel,
      type: "execution",
      method: resolvedRequestConfig.method,
      callArgs: callArgs as TCallArgs,
      mockCache,
      response: {} as AxiosResponse, // The response context is handled below
      error: undefined
    };

    try {
      response = await axiosInstance.request({
        ...resolvedRequestConfig,
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
      for await (const middleware of this.getMiddlewares<
        TCallArgs,
        TResponseModel,
        TResponseDTO,
        TRequestModel,
        TRequestDTO
      >("execution")) {
        await middleware(context);
      }
    }

    const dto = transform(response.data, this.responseDTO);
    const model = transform(response.data, this.responseModel, {
      excludeExtraneousValues: true
    });

    return {
      response,
      dto,
      model
    };
  }

  public async mock(
    ...args: [
      ...callArgs: RequestArgs<TRequestModel, TCallArgs>,
      count?: number
    ]
  ): Promise<AcquireResult<TResponseModel, TResponseDTO>> {
    const { axiosInstance, mockCache } = this.getConfig();

    let count = 10;

    if (typeof args[args.length - 1] === "number") {
      count = args.pop() as number;
    }
    const callArgs = args[0] as RequestArgs<TRequestModel, TCallArgs>[0];

    const resolvedRequestConfig = this.resolveRequestConfig(
      this.requestConfig,
      callArgs
    );

    let requestData = callArgs?.data;
    if (this.requestDTO && callArgs?.data) {
      const plainData = instanceToPlain(callArgs.data);

      requestData = transform(plainData, this.requestDTO, {
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

    let mockResponse = {
      config: mergeConfigObjects(
        axiosInstance.defaults,
        resolvedRequestConfig,
        {
          data: requestData
        }
      ),
      data: undefined,
      status: 200,
      statusText: "OK"
    } as Partial<AxiosResponse>;

    const context: AcquireContext<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    > = {
      requestConfig: resolvedRequestConfig,
      responseModel: this.responseModel,
      responseDTO: this.responseDTO,
      requestDTO: this.requestDTO,
      requestModel: this.requestModel,
      type: "mocking",
      method: resolvedRequestConfig.method,
      callArgs: callArgs as TCallArgs,
      mockCache,
      response: mockResponse as AxiosResponse,
      error: undefined
    };

    for await (const middleware of this.getMiddlewares<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >("mocking")) {
      try {
        await middleware(context);
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

    mockResponse = { ...mockResponse, ...context.response };

    if (mockResponse.data == null && isClassOrClassArray(this.responseDTO)) {
      const { ClassUnwrapped: DTOUnwrapped, isClassArray: isDTOArray } =
        unwrapClassOrClassArray(this.responseDTO);
      const genericContext = context as AcquireContext;

      const mockResult = await (isDTOArray
        ? generateMock(DTOUnwrapped, count, mockCache, genericContext)
        : generateMock(DTOUnwrapped, undefined, mockCache, genericContext));

      mockResponse.data = instanceToPlain(mockResult);
    }

    const mockDto = transform(mockResponse?.data, this.responseDTO);
    const mockModel = transform(mockResponse?.data, this.responseModel, {
      excludeExtraneousValues: true
    });

    return {
      response: mockResponse as AxiosResponse,
      dto: mockDto,
      model: mockModel
    };
  }
}
