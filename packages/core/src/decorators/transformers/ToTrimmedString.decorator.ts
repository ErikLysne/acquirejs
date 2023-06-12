import convertToString from "@/functions/convertToString.function";
import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToTrimmedStringOptions extends AcquireTransformerOptions {}

export default function ToTrimmedString(
  options?: ToTrimmedStringOptions
): PropertyDecorator {
  const { fallback = null, classTransformOptions } = options ?? {};

  return Transform(
    ({ value }) => convertToString(value)?.trim() || fallback,
    classTransformOptions
  );
}
