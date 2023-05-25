import { AxiosResponse } from "axios";
import { ClassOrClassArray } from "./ClassOrClassArray.interface";
import { InstanceOrInstanceArray } from "./InstanceOrInstanceArray.interface";

export interface AcquireResult<
  TResponseDTO extends ClassOrClassArray | undefined,
  TResponseModel extends ClassOrClassArray | undefined
> {
  response: AxiosResponse;
  dto: InstanceOrInstanceArray<TResponseDTO>;
  model: InstanceOrInstanceArray<TResponseModel>;
}
