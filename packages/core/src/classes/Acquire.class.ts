import { AcquireArgs } from "@/interfaces/AcquireArgs.interface";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";
import { Logger } from "@/interfaces/Logger.interface";
import { OmitFirstArg } from "@/interfaces/OmitFirstArg.interface";
import axios, { AxiosInstance } from "axios";
import AcquireMockCache from "./AcquireMockCache.class";
import {
  AcquireRequestExecutor,
  AcquireRequestExecutorGetConfig
} from "./AcquireRequestExecutor.class";
import { CallableInstance } from "./CallableInstance.class";

interface BoundAcquireRequestExecutor<
  TCallArgs extends AcquireCallArgs = object,
  TResponseDTO extends ClassOrClassArray = any,
  TResponseModel extends ClassOrClassArray = any,
  TRequestDTO extends ClassOrClassArray = any,
  TRequestModel extends ClassOrClassArray = any
> {
  /*
        Note: All methods that should be exposed from AcquireRequestExecutor
        to the callable Acquire instance should be specified explicitly here.
    */
  (
    ...callArgs: Parameters<
      OmitFirstArg<
        AcquireRequestExecutor<
          TCallArgs,
          TResponseDTO,
          TResponseModel,
          TRequestDTO,
          TRequestModel
        >["execute"]
      >
    >
  ): ReturnType<
    AcquireRequestExecutor<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    >["execute"]
  >;

  execute: OmitFirstArg<
    AcquireRequestExecutor<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    >["execute"]
  >;
  mock: OmitFirstArg<
    AcquireRequestExecutor<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    >["mock"]
  >;
  setMockInterceptor: AcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >["setMockInterceptor"];
  clearMockInterceptor: AcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >["clearMockInterceptor"];
}

export interface Acquire {
  <
    TCallArgs extends AcquireCallArgs = object,
    TResponseDTO extends ClassOrClassArray = any,
    TResponseModel extends ClassOrClassArray = any,
    TRequestDTO extends ClassOrClassArray = any,
    TRequestModel extends ClassOrClassArray = any
  >(
    args?: AcquireArgs<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel,
      false
    >
  ): BoundAcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >;
}

export class Acquire extends CallableInstance {
  private __isAcquireInstance = true;

  constructor(
    private axiosInstance: AxiosInstance = axios,
    private logger?: Logger,
    private mockCache?: AcquireMockCache,
    private isMockingEnabled = false
  ) {
    super((acquireArgs: AcquireArgs) => this.acquire(acquireArgs));
  }

  static isAcquireInstance(instance: unknown): instance is Acquire {
    return !!(instance as Acquire)?.__isAcquireInstance;
  }

  public setAxiosInstance(axiosInstance: AxiosInstance): this {
    this.axiosInstance = axiosInstance;
    return this;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  public useLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  public getLogger(): Logger | undefined {
    return this.logger;
  }

  public useMockCache(mockCache: AcquireMockCache): this {
    this.mockCache = mockCache;
    return this;
  }

  public getMockCache(): AcquireMockCache | undefined {
    return this.mockCache;
  }

  public enableMocking(): this {
    this.isMockingEnabled = true;
    return this;
  }

  public disableMocking(): this {
    this.isMockingEnabled = false;
    return this;
  }

  public setMockingEnabled(enabled: boolean): this {
    this.isMockingEnabled = enabled;
    return this;
  }

  public getMockingEnabled(): boolean {
    return this.isMockingEnabled;
  }

  public acquire<
    TCallArgs extends AcquireCallArgs = object,
    TResponseDTO extends ClassOrClassArray = any,
    TResponseModel extends ClassOrClassArray = any,
    TRequestDTO extends ClassOrClassArray = any,
    TRequestModel extends ClassOrClassArray = any
  >(
    args: AcquireArgs<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel,
      false
    >
  ): BoundAcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  > {
    const { request } = args;

    if (!request?.path && !request?.url && !request?.baseURL) {
      this.logger?.warn("'baseURL', 'url' or 'path' is missing.");
    }

    const getConfig: AcquireRequestExecutorGetConfig = () => ({
      axiosInstance: this.axiosInstance,
      logger: this.logger,
      mockCache: this.mockCache,
      isMockingEnabled: this.isMockingEnabled
    });

    const requestExecutor = new AcquireRequestExecutor<
      any,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    >(getConfig);

    requestExecutor.execute = requestExecutor.execute.bind(
      requestExecutor,
      args
    );

    requestExecutor.mock = requestExecutor.mock.bind(requestExecutor, args);

    return requestExecutor as BoundAcquireRequestExecutor<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel
    >;
  }

  public withCallArgs<TCallArgs extends AcquireCallArgs>(): <
    TResponseDTO extends ClassOrClassArray = any,
    TResponseModel extends ClassOrClassArray = any,
    TRequestDTO extends ClassOrClassArray = any,
    TRequestModel extends ClassOrClassArray = any
  >(
    args: AcquireArgs<
      TCallArgs,
      TResponseDTO,
      TResponseModel,
      TRequestDTO,
      TRequestModel,
      false
    >
  ) => BoundAcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  > {
    return (args) => this.acquire(args);
  }
}
