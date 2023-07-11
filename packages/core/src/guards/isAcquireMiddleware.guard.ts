import { AcquireMiddlewareClass } from "@/interfaces/AcquireMiddleware.interface";

export default function isAcquireMiddlewareClass(
  obj: any
): obj is AcquireMiddlewareClass {
  return "handle" in obj;
}
