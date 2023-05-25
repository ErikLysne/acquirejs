import isCallable from "@/guards/isCallable.guard";
import { ValueOrCallback } from "@/interfaces/ValueOrCallback.interface";

export default function resolveValueOrCallback<TValue>(
  valueOrCallback: ValueOrCallback<TValue, any>,
  args: any
): TValue {
  return isCallable(valueOrCallback) ? valueOrCallback(args) : valueOrCallback;
}
