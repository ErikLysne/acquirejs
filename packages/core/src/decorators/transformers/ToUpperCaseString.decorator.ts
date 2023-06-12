import convertToString from "@/functions/convertToString.function";
import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToUpperCaseStringOptions extends AcquireTransformerOptions {}

export default function ToUpperCaseString(
  options?: ToUpperCaseStringOptions
): PropertyDecorator {
  const { fallback = null, classTransformOptions } = options ?? {};

  return Transform(
    ({ value }) => convertToString(value)?.toUpperCase() || fallback,
    classTransformOptions
  );
}
