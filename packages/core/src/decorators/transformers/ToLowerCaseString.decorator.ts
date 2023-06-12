import convertToString from "@/functions/convertToString.function";
import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToLowerCaseStringOptions extends AcquireTransformerOptions {}

export default function ToLowerCaseString(
  options?: ToLowerCaseStringOptions
): PropertyDecorator {
  const { fallback = null, classTransformOptions } = options ?? {};

  return Transform(
    ({ value }) => convertToString(value)?.toLowerCase() || fallback,
    classTransformOptions
  );
}
