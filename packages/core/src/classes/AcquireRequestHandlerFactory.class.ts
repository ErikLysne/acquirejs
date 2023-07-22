import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { AcquireRequestConfig } from "@/interfaces/AcquireRequestConfig.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";
import AcquireBase from "./AcquireBase.class";
import {
  AcquireRequestHandler,
  AcquireRequestHandlerConfig
} from "./AcquireRequestHandler.class";

export type AcquireRequestMethodConfig<TCallArgs extends AcquireCallArgs> =
  Omit<AcquireRequestConfig<TCallArgs>, "method">;

export default class AcquireRequestHandlerFactory<
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> extends AcquireBase<
  never,
  TResponseModel,
  TResponseDTO,
  TRequestModel,
  TRequestDTO
> {
  private responseModel: TResponseModel | undefined;
  private responseDTO: TResponseDTO | undefined;
  private requestModel: TRequestModel | undefined;
  private requestDTO: TRequestDTO | undefined;

  constructor(private getConfig: () => AcquireRequestHandlerConfig) {
    super();
  }

  withResponseMapping<
    TResponseModelOverload extends ClassOrClassArray,
    TResponseDTOOverload extends ClassOrClassArray
  >(
    model?: TResponseModelOverload,
    dto?: TResponseDTOOverload
  ): AcquireRequestHandlerFactory<
    TResponseModelOverload,
    TResponseDTOOverload,
    TRequestModel,
    TRequestDTO
  > {
    const factory = this.cloneBase<
      never,
      TResponseModelOverload,
      TResponseDTOOverload,
      TRequestModel,
      TRequestDTO
    >().into(
      new AcquireRequestHandlerFactory<
        TResponseModelOverload,
        TResponseDTOOverload,
        TRequestModel,
        TRequestDTO
      >(this.getConfig)
    );
    factory.responseModel = model;
    factory.responseDTO = dto;
    return factory;
  }

  withRequestMapping<
    TRequestModelOverload extends ClassOrClassArray,
    TRequestDTOOverload extends ClassOrClassArray
  >(
    model?: TRequestModelOverload,
    dto?: TRequestDTOOverload
  ): AcquireRequestHandlerFactory<
    TResponseModel,
    TResponseDTO,
    TRequestModelOverload,
    TRequestDTOOverload
  > {
    const factory = this.cloneBase<
      never,
      TResponseModel,
      TResponseDTO,
      TRequestModelOverload,
      TRequestDTOOverload
    >().into(
      new AcquireRequestHandlerFactory<
        TResponseModel,
        TResponseDTO,
        TRequestModelOverload,
        TRequestDTOOverload
      >(this.getConfig)
    );
    factory.requestModel = model;
    factory.requestDTO = dto;
    return factory;
  }

  request<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    const executor = new AcquireRequestHandler(
      requestConfig,
      this.getConfig,
      this.responseModel,
      this.responseDTO,
      this.requestModel,
      this.requestDTO
    );

    return this.cloneBase<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >().into(executor);
  }

  get<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "GET" });
  }

  post<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "POST" });
  }

  put<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "PUT" });
  }

  patch<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "PATCH" });
  }

  delete<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "DELETE" });
  }

  head<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "HEAD" });
  }

  options<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "OPTIONS" });
  }

  purge<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "PURGE" });
  }

  link<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "LINK" });
  }

  unlink<TCallArgs extends AcquireCallArgs = never>(
    requestConfig: AcquireRequestMethodConfig<TCallArgs>
  ): AcquireRequestHandler<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > {
    return this.request({ ...requestConfig, method: "UNLINK" });
  }
}
