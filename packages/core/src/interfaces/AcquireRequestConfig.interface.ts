import { RequestMethodType } from "@/constants/RequestMethod.const";
import { AxiosRequestConfig } from "axios";
import { ValueOrCallback } from "./ValueOrCallback.interface";

type ForwardedAxiosRequestConfigKeys =
  | "url"
  | "baseURL"
  | "headers"
  | "responseEncoding"
  | "responseType"
  | "timeout"
  | "timeoutErrorMessage";

export type AcquireRequestConfig<
  TCallArgs,
  TValueOnly extends boolean = false
> = {
  [Key in ForwardedAxiosRequestConfigKeys]?: ValueOrCallback<
    AxiosRequestConfig[Key],
    TCallArgs,
    TValueOnly
  >;
} & {
  path?: ValueOrCallback<AxiosRequestConfig["url"], TCallArgs, TValueOnly>;
  params?: ValueOrCallback<Record<string, any>, TCallArgs, TValueOnly>;
  method?: ValueOrCallback<RequestMethodType, TCallArgs, TValueOnly>;
  axiosConfig?: AxiosRequestConfig;
};
