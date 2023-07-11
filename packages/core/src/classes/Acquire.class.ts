import { AcquireArgs } from "@/interfaces/AcquireArgs.interface";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import {
  AcquireMiddleware,
  AcquireMiddlewareWithOrder
} from "@/interfaces/AcquireMiddleware.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";
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
  use: AcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >["use"];
  useOnExecution: AcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >["useOnExecution"];
  useOnMocking: AcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >["useOnMocking"];
  clearMiddlewares: AcquireRequestExecutor<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >["clearMiddlewares"];
}

export interface Acquire {
  <
    TCallArgs extends AcquireCallArgs = object,
    TResponseDTO extends ClassOrClassArray = any,
    TResponseModel extends ClassOrClassArray = any,
    TRequestDTO extends ClassOrClassArray = any,
    TRequestModel extends ClassOrClassArray = any
  >(
    acquireArgs: AcquireArgs<
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
  private executionMiddlewares: AcquireMiddlewareWithOrder[] = [];
  private mockingMiddlewares: AcquireMiddlewareWithOrder[] = [];

  constructor(
    private axiosInstance: AxiosInstance = axios,
    private mockCache?: AcquireMockCache,
    private isMockingEnabled = false
  ) {
    super((acquireArgs: AcquireArgs) => this.acquire(acquireArgs));
  }

  static isAcquireInstance(instance: unknown): instance is Acquire {
    return !!(instance as Acquire)?.__isAcquireInstance;
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

  public setAxiosInstance(axiosInstance: AxiosInstance): this {
    this.axiosInstance = axiosInstance;
    return this;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
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
    acquireArgs: AcquireArgs<
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
    const { request } = acquireArgs;

    if (!request.path && !request.url && !request.baseURL) {
      console.warn("'baseURL', 'url' or 'path' is missing.");
    }

    const getConfig: AcquireRequestExecutorGetConfig = () => ({
      axiosInstance: this.axiosInstance,
      executionMiddlewares: this.executionMiddlewares,
      mockingMiddlewares: this.mockingMiddlewares,
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
      acquireArgs
    );

    requestExecutor.mock = requestExecutor.mock.bind(
      requestExecutor,
      acquireArgs
    );

    return requestExecutor as unknown as BoundAcquireRequestExecutor<
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
    acquireArgs: AcquireArgs<
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
    return (acquireArgs) => this.acquire(acquireArgs);
  }
}
