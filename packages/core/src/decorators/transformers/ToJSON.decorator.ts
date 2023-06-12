import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToJSONOptions
  extends Omit<AcquireTransformerOptions, "fallback"> {}

export default function ToJSON(options?: ToJSONOptions): PropertyDecorator {
  const { classTransformOptions } = options ?? {};

  return Transform(({ value }) => {
    return JSON.stringify(value);
  }, classTransformOptions);
}
