import axios, { AxiosInstance } from "axios";
import AcquireBase from "./AcquireBase.class";
import AcquireMockCache from "./AcquireMockCache.class";
import AcquireRequestFactory from "./AcquireRequestHandlerFactory.class";

export class Acquire extends AcquireBase {
  constructor(
    private axiosInstance: AxiosInstance = axios,
    private mockCache: AcquireMockCache | undefined = undefined,
    private isMockingEnabled = false
  ) {
    super();
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

  public createRequestHandler(): AcquireRequestFactory {
    return this.cloneBase().into(
      new AcquireRequestFactory(() => ({
        axiosInstance: this.axiosInstance,
        isMockingEnabled: this.isMockingEnabled,
        mockCache: this.mockCache
      }))
    );
  }
}
