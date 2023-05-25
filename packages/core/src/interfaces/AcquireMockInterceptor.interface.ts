import { AxiosResponse } from "axios";
import { AcquireCallArgs } from "./AcquireCallArgs.interface";
import { AcquireMockContext } from "./AcquireMockContext.interface";
import { ClassOrClassArray } from "./ClassOrClassArray.interface";

export type AcquireMockInterceptor<
  TCallArgs extends AcquireCallArgs = any,
  TResponseDTO extends ClassOrClassArray = ClassOrClassArray,
  TResponseModel extends ClassOrClassArray = ClassOrClassArray,
  TRequestDTO extends ClassOrClassArray = ClassOrClassArray,
  TRequestModel extends ClassOrClassArray = ClassOrClassArray
> = (
  context: AcquireMockContext<
    TCallArgs,
    TResponseDTO,
    TResponseModel,
    TRequestDTO,
    TRequestModel
  >
) => Promise<Partial<AxiosResponse>>;
