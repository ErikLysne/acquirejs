import {
  AcquireMiddlewareClass,
  AcquireMiddlewareFn
} from "@/classes/AcquireBase.class";
import isCallable from "@/guards/isCallable.guard";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";

export type DelaySimulatorLimit<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> =
  | number
  | ((
      context: AcquireContext<
        TCallArgs,
        TResponseModel,
        TResponseDTO,
        TRequestModel,
        TRequestDTO
      >
    ) => number);

export interface DelaySimulatorOptions<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> {
  order?: number;
  min?: DelaySimulatorLimit<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >;
  max?: DelaySimulatorLimit<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >;
}

export default class DelaySimulator<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> implements
    AcquireMiddlewareClass<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >
{
  public order: number;

  private min: DelaySimulatorLimit<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >;
  private max: DelaySimulatorLimit<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >;

  constructor(
    options?: DelaySimulatorOptions<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >
  ) {
    const { order = 100, min = 100, max = 200 } = options ?? {};
    this.order = order;
    this.min = min;
    this.max = max;
  }

  handle: AcquireMiddlewareFn<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  > = (context) => {
    const min = isCallable(this.min) ? this.min(context) : this.min;
    const max = isCallable(this.max) ? this.max(context) : this.max;

    const delay = Math.random() * (max - min) + min;

    return new Promise((resolve) => setTimeout(resolve, delay));
  };
}
