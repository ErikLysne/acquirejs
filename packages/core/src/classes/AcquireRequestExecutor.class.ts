import RequestMethod, {
  RequestMethodType
} from "@/constants/RequestMethod.const";
import generateMock from "@/functions/generateMock.function";
import resolveValueOrCallback from "@/functions/resolveValueOrCallback.function";
import transform from "@/functions/transform.function";
import unwrapClassOrClassArray from "@/functions/unwrapClassArray.function";
import { AcquireArgs } from "@/interfaces/AcquireArgs.interface";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { AcquireMockContext } from "@/interfaces/AcquireMockContext.interface";
import { AcquireMockInterceptor } from "@/interfaces/AcquireMockInterceptor.interface";
import { AcquireRequestOptions } from "@/interfaces/AcquireRequestOptions.interface";
import { AcquireResult } from "@/interfaces/AcquireResult.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";
import { InstanceOrInstanceArray } from "@/interfaces/InstanceOrInstanceArray.interface";
import { Logger } from "@/interfaces/Logger.interface";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { instanceToPlain } from "class-transformer";
import AcquireLogger, { AcquireLogColor } from "./AcquireLogger.class";
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
  logger?: Logger;
  mockCache?: AcquireMockCache;
  isMockingEnabled?: boolean;
};

export class AcquireRequestExecutor<
  TCallArgs extends AcquireCallArgs = object,
  TResponseDTO extends ClassOrClassArray = any,
  TResponseModel extends ClassOrClassArray = any,
  TRequestDTO extends ClassOrClassArray = any,
  TRequestModel extends ClassOrClassArray = any
> extends CallableInstance {
  private __isAcquireRequestExecutorInstance = true;
  private mockInterceptor:
    | AcquireMockInterceptor<
        TCallArgs,
        TResponseDTO,
        TResponseModel,
        TRequestDTO,
        TRequestModel
      >
    | undefined;

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
    const { request, responseMapping, requestMapping, axiosConfig } =
      acquireArgs;
    const { axiosInstance, logger, isMockingEnabled } = this.getConfig();

    if (isMockingEnabled) {
      return this.mock(acquireArgs, callArgs);
    }

    let requestData = callArgs?.data;
    if (requestMapping && requestMapping.DTO && callArgs?.data) {
      const plainData = instanceToPlain(callArgs.data);

      requestData = transform(plainData, requestMapping.DTO, {
        excludeExtraneousValues: true
      });
    }

    const requestConfig = request
      ? this.resolveRequestConfig(request, callArgs, axiosConfig)
      : {};

    let response: AxiosResponse;

    try {
      response = await axiosInstance.request({
        ...requestConfig,
        data: requestData
      });
      this.logAcquireCall(
        logger,
        response,
        requestConfig.method as RequestMethodType
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logAcquireCall(
          logger,
          error.response ?? {},
          requestConfig.method as RequestMethodType
        );
      }

      throw error;
    }

    const dto = transform(response.data, responseMapping?.DTO);
    const model = transform(response.data, responseMapping?.Model, {
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
    const { request, responseMapping, requestMapping, axiosConfig } =
      acquireArgs;
    const { axiosInstance, logger, mockCache } = this.getConfig();

    let mockDto: InstanceOrInstanceArray<TResponseDTO> | undefined = undefined;
    let mockModel: InstanceOrInstanceArray<TResponseModel> | undefined =
      undefined;

    const requestConfig = (
      request ? this.resolveRequestConfig(request, callArgs, axiosConfig) : {}
    ) as AxiosRequestConfig & { method: RequestMethodType };

    let requestData = callArgs?.data;
    if (requestMapping && requestMapping.DTO && callArgs?.data) {
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

    let mockResponse = {
      config: mergeConfigObjects(axiosInstance.defaults, requestConfig, {
        data: requestData
      }),
      data: undefined,
      status: 200,
      statusText: "OK"
    } as Partial<AxiosResponse>;

    const { request: _request, ...rest } = acquireArgs ?? {};
    const mockContext: AcquireMockContext<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    > = {
      args: {
        ...rest,
        request: requestConfig
      },
      callArgs,
      mockResponse,
      mockCache,
      delay(
        minDuration: number,
        maxDuration: number = minDuration
      ): Promise<void> {
        const duration =
          Math.random() * (maxDuration - minDuration) + minDuration;
        return new Promise((resolve) => setTimeout(resolve, duration));
      }
    };

    if (this.mockInterceptor) {
      mockResponse = await this.mockInterceptor(mockContext);
    } else if (responseMapping?.DTO) {
      const { ClassUnwrapped: DTOUnwrapped, isClassArray: isDTOArray } =
        unwrapClassOrClassArray(responseMapping?.DTO);

      const mockResult = await (isDTOArray
        ? generateMock(
            DTOUnwrapped,
            callArgs?.$count ?? 10,
            mockCache,
            mockContext as any
          )
        : generateMock(DTOUnwrapped, undefined, mockCache, mockContext as any));

      mockResponse.data = instanceToPlain(mockResult);
    }

    mockDto = transform(mockResponse?.data, responseMapping?.DTO);
    mockModel = transform(mockResponse?.data, responseMapping?.Model, {
      excludeExtraneousValues: true
    });

    this.logAcquireCall(
      logger,
      mockResponse,
      requestConfig.method,
      true,
      typeof this.mockInterceptor === "function"
    );

    return {
      response: mockResponse as AxiosResponse,
      dto: mockDto!,
      model: mockModel!
    };
  }

  public setMockInterceptor(
    mockInterceptor: AcquireMockInterceptor<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    >
  ): this {
    this.mockInterceptor = mockInterceptor;
    return this;
  }

  public clearMockInterceptor(): this {
    delete this.mockInterceptor;
    return this;
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

  private logAcquireCall(
    logger?: Logger,
    response?: Partial<AxiosResponse>,
    method?: RequestMethodType,
    isMocked?: boolean,
    hasMockInterceptor?: boolean
  ): void {
    if (!logger || !response) {
      return;
    }

    const colorize =
      logger instanceof AcquireLogger
        ? AcquireLogger.colorize
        : (message: string, ..._args: any[]): string => message;

    function colorizeStatusCode(statusCode: number): AcquireLogColor {
      const statusClass = Math.floor(statusCode / 100);

      switch (statusClass) {
        case 1: // Informational
          return "blue";
        case 2: // Success
          return "green";
        case 3: // Redirection
          return "yellow";
        case 4: // Client error
          return "brightRed";
        case 5: // Server error
          return "red";
        default: // Unknown status code
          return "gray";
      }
    }

    const uri = axios.getUri(response.config);
    const urlObj = new URL(uri);

    const executedOrMocked = `[${
      isMocked ? colorize("MOCKED", "yellow") : colorize("EXECUTED", "green")
    }]`;
    const requestMethod = method ? `[${RequestMethod[method]}]` : "";
    const atPath = `@ ${urlObj.pathname}`;
    const status = colorize(
      `[${response.status}]`,
      colorizeStatusCode(response.status ?? 200)
    );
    const mockSource = hasMockInterceptor
      ? colorize("-> [FROM INTERCEPTOR]", "yellow")
      : colorize("-> [ON DEMAND]", "yellow");

    const log = [
      executedOrMocked,
      requestMethod,
      atPath,
      status,
      isMocked ? mockSource : ""
    ] as const;

    response.status && response.status >= 400
      ? logger.error(...log)
      : logger.info(...log);
  }
}
