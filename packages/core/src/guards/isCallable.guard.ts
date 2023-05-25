import { ValueOrCallback } from "@/interfaces/ValueOrCallback.interface";

export default function isCallable(
  valueOrCallback: ValueOrCallback<any, any>
): valueOrCallback is (...args: any) => any {
  return typeof valueOrCallback === "function";
}
