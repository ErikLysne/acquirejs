import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToDateOptions extends AcquireTransformerOptions {}

export default function ToDate(options?: ToDateOptions): PropertyDecorator {
  const { fallback = null, classTransformOptions } = options ?? {};

  return Transform(({ value }) => {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      return isNaN(date.getTime()) ? fallback : date;
    }

    return fallback;
  }, classTransformOptions);
}
