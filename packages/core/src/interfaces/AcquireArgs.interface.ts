import { AxiosRequestConfig } from "axios";

import { AcquireCallArgs } from "./AcquireCallArgs.interface";
import { AcquireRequestOptions } from "./AcquireRequestOptions.interface";
import { ClassOrClassArray } from "./ClassOrClassArray.interface";

export interface AcquireArgs<
  TCallArgs extends AcquireCallArgs = any,
  TResponseDTO extends ClassOrClassArray = never,
  TResponseModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never,
  TRequestModel extends ClassOrClassArray = never,
  TRequestOptionsValueOnly extends boolean = false
> {
  callArgs?: TCallArgs;
  request?: AcquireRequestOptions<TCallArgs, TRequestOptionsValueOnly>;
  requestMapping?: {
    DTO?: TRequestDTO;
    Model?: TRequestModel;
  };
  responseMapping?: {
    DTO?: TResponseDTO;
    Model?: TResponseModel;
  };
  axiosConfig?: AxiosRequestConfig;
}
