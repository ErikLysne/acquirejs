import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToBooleanOptions
  extends Omit<AcquireTransformerOptions, "fallback"> {
  falsyValues?: any[];
}

export default function ToBoolean(
  options?: ToBooleanOptions
): PropertyDecorator {
  const {
    falsyValues = [false, undefined, null, 0, NaN, "false", "0", ""],
    classTransformOptions
  } = options ?? {};
  const falsySet = new Set(falsyValues.filter((val) => !Number.isNaN(val)));
  const shouldTreatNaNAsFalsy = falsyValues.some(Number.isNaN);

  return Transform(({ value }) => {
    if (typeof value === "number" && isNaN(value)) {
      return !shouldTreatNaNAsFalsy;
    }
    return !falsySet.has(value);
  }, classTransformOptions);
}
