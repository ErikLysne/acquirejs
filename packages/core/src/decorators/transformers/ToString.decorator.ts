import convertToString from "@/functions/convertToString.function";
import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToStringOptions extends AcquireTransformerOptions {}

export default function ToString(options?: ToStringOptions): PropertyDecorator {
  const { fallback = null, classTransformOptions } = options ?? {};

  return Transform(
    ({ value }) => convertToString(value) || fallback,
    classTransformOptions
  );
}
