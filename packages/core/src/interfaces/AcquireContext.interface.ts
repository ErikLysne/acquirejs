import AcquireMockCache from "@/classes/AcquireMockCache.class";
import { RequestMethodType } from "@/constants/RequestMethod.const";
import AcquireError from "@/errors/AcquireError.error";
import { AxiosResponse } from "axios";
import { AcquireRequestConfig } from "./AcquireRequestConfig.interface";

export interface AcquireContext<
  TCallArgs = never,
  TResponseModel = unknown,
  TResponseDTO = unknown,
  TRequestModel = unknown,
  TRequestDTO = unknown
> {
  readonly requestConfig: AcquireRequestConfig<TCallArgs, true>;
  readonly type: "mocking" | "execution";
  readonly method: RequestMethodType;
  readonly responseModel?: TResponseModel;
  readonly responseDTO?: TResponseDTO;
  readonly requestModel?: TRequestModel;
  readonly requestDTO?: TRequestDTO;
  readonly callArgs?: TCallArgs;
  readonly mockCache?: AcquireMockCache;

  response: AxiosResponse;
  error?: AcquireError;
}
