import { AcquireContext } from "./AcquireContext.interface";

export type AcquireMiddlewareFn = (context: AcquireContext) => void;

export interface AcquireMiddlewareClass {
  order?: number;
  handle: AcquireMiddlewareFn;
}

export type AcquireMiddleware = AcquireMiddlewareFn | AcquireMiddlewareClass;

export type AcquireMiddlewareWithOrder = [
  middleware: AcquireMiddleware,
  order: number
];
