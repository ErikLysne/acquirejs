import AcquireMockCache from "@/classes/AcquireMockCache.class";
import { AxiosResponse } from "axios";
import { AcquireArgs } from "./AcquireArgs.interface";
import { AcquireCallArgs } from "./AcquireCallArgs.interface";
import { ClassOrClassArray } from "./ClassOrClassArray.interface";
import { InstanceOrInstanceArray } from "./InstanceOrInstanceArray.interface";

export interface AcquireMockContext<
  TCallArgs extends AcquireCallArgs = any,
  TResponseDTO extends ClassOrClassArray = any,
  TResponseModel extends ClassOrClassArray = any,
  TRequestDTO extends ClassOrClassArray = any,
  TRequestModel extends ClassOrClassArray = any
> {
  mockResponse: Partial<AxiosResponse>;
  callArgs?: TCallArgs & { data?: InstanceOrInstanceArray<TRequestModel> };
  args?: AcquireArgs<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel,
    true
  >;
  mockCache?: AcquireMockCache;
  delay: (minDuration: number, maxDuration?: number) => Promise<void>;
}
