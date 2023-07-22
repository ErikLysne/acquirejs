import { AcquireMiddlewareClass } from "@/classes/AcquireBase.class";

export default function isAcquireMiddlewareClass(
  obj: any
): obj is AcquireMiddlewareClass {
  return "handle" in obj;
}
