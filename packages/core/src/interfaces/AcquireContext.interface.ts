import AcquireMockCache from "@/classes/AcquireMockCache.class";
import { RequestMethodType } from "@/constants/RequestMethod.const";
import AcquireError from "@/errors/AcquireError.error";
import { AxiosResponse } from "axios";
import { AcquireArgs } from "./AcquireArgs.interface";
import { AcquireCallArgs } from "./AcquireCallArgs.interface";
import { ClassOrClassArray } from "./ClassOrClassArray.interface";
import { InstanceOrInstanceArray } from "./InstanceOrInstanceArray.interface";

export interface AcquireContext<
  TCallArgs extends AcquireCallArgs = any,
  TResponseDTO extends ClassOrClassArray = any,
  TResponseModel extends ClassOrClassArray = any,
  TRequestDTO extends ClassOrClassArray = any,
  TRequestModel extends ClassOrClassArray = any
> {
  readonly acquireArgs: AcquireArgs<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel,
    true
  >;
  readonly type: "mocking" | "execution";
  readonly method: RequestMethodType;
  readonly callArgs?: TCallArgs & {
    data?: InstanceOrInstanceArray<TRequestModel>;
  };
  readonly mockCache?: AcquireMockCache;
  readonly mockDataGenerationPrevented: () => boolean;
  readonly preventMockDataGeneration: () => void;

  response: AxiosResponse;
  error?: AcquireError;
}
