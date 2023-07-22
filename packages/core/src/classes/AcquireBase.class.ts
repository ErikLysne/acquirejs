import isAcquireMiddlewareClass from "@/guards/isAcquireMiddleware.guard";
import { AcquireCallArgs } from "@/interfaces/AcquireCallArgs.interface";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";

export type AcquireMiddlewareFn<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> = (
  context: AcquireContext<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >
) => void | Promise<void>;

export interface AcquireMiddlewareClass<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> {
  order?: number;
  handle: AcquireMiddlewareFn<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >;
}

export type AcquireMiddleware<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> =
  | AcquireMiddlewareFn<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >
  | AcquireMiddlewareClass<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >;

export type AcquireMiddlewareWithOrder<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> = [
  middleware: AcquireMiddleware<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >,
  order: number
];

export default abstract class AcquireBase<
  TCallArgs extends AcquireCallArgs = never,
  TResponseModel extends ClassOrClassArray | unknown = unknown,
  TResponseDTO extends ClassOrClassArray | unknown = unknown,
  TRequestModel extends ClassOrClassArray = never,
  TRequestDTO extends ClassOrClassArray = never
> extends Function {
  private executionMiddlewares: AcquireMiddlewareWithOrder<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >[] = [];
  private mockingMiddlewares: AcquireMiddlewareWithOrder<
    TCallArgs,
    TResponseModel,
    TResponseDTO,
    TRequestModel,
    TRequestDTO
  >[] = [];

  protected cloneBase<
    TCallArgsOverload extends AcquireCallArgs = never,
    TResponseModelOverload extends ClassOrClassArray | unknown = unknown,
    TResponseDTOOverload extends ClassOrClassArray | unknown = unknown,
    TRequestModelOverload extends ClassOrClassArray = never,
    TRequestDTOOverload extends ClassOrClassArray = never
  >(): {
    into: <
      TTarget extends AcquireBase<
        TCallArgsOverload,
        TResponseModelOverload,
        TResponseDTOOverload,
        TRequestModelOverload,
        TRequestDTOOverload
      >
    >(
      target: TTarget
    ) => TTarget;
  } {
    return {
      into: <
        TTarget extends AcquireBase<
          TCallArgsOverload,
          TResponseModelOverload,
          TResponseDTOOverload,
          TRequestModelOverload,
          TRequestDTOOverload
        >
      >(
        target: TTarget
      ): TTarget => {
        target.executionMiddlewares = [...this.executionMiddlewares] as any;
        target.mockingMiddlewares = [...this.mockingMiddlewares] as any;
        return target;
      }
    };
  }

  protected resolveMiddlewares(
    middlewaresWithOrder: AcquireMiddlewareWithOrder<any, any, any, any, any>[]
  ): AcquireMiddlewareFn<any, any, any, any, any>[] {
    const middlewareFnsWithOrder: [
      middlewareFn: AcquireMiddlewareFn<any, any, any, any, any>,
      order: number
    ][] = [];

    for (const orderedMiddleware of middlewaresWithOrder) {
      const [middleware, order] = orderedMiddleware;
      if (isAcquireMiddlewareClass(middleware)) {
        middlewareFnsWithOrder.push([
          middleware.handle,
          middleware.order ?? order
        ]);
      } else {
        middlewareFnsWithOrder.push([middleware, order]);
      }
    }

    return middlewareFnsWithOrder
      .sort((a, b) => a[1] - b[1])
      .map(([middlewareFn]) => middlewareFn);
  }

  protected getMiddlewares<
    TCallArgsOverload extends AcquireCallArgs = never,
    TResponseModelOverload extends ClassOrClassArray | unknown = unknown,
    TResponseDTOOverload extends ClassOrClassArray | unknown = unknown,
    TRequestModelOverload extends ClassOrClassArray = never,
    TRequestDTOOverload extends ClassOrClassArray = never
  >(
    mode: AcquireContext["type"]
  ): AcquireMiddlewareFn<
    TCallArgsOverload,
    TResponseModelOverload,
    TResponseDTOOverload,
    TRequestModelOverload,
    TRequestDTOOverload
  >[] {
    return this.resolveMiddlewares(
      mode === "execution" ? this.executionMiddlewares : this.mockingMiddlewares
    );
  }

  public use(
    middleware: AcquireMiddleware<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >,
    order = 0
  ): this {
    this.executionMiddlewares.push([middleware, order]);
    this.mockingMiddlewares.push([middleware, order]);
    return this;
  }

  public useOnExecution(
    middleware: AcquireMiddleware<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >,
    order = 0
  ): this {
    this.executionMiddlewares.push([middleware, order]);
    return this;
  }

  public useOnMocking(
    middleware: AcquireMiddleware<
      TCallArgs,
      TResponseModel,
      TResponseDTO,
      TRequestModel,
      TRequestDTO
    >,
    order = 0
  ): this {
    this.mockingMiddlewares.push([middleware, order]);
    return this;
  }

  public clearMiddlewares(): this {
    this.executionMiddlewares = [];
    this.mockingMiddlewares = [];
    return this;
  }
}
