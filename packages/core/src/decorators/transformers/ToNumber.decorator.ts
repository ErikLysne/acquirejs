import { AcquireTransformerOptions } from "@/interfaces/AcquireTransformerOptions.interface";
import { Transform } from "class-transformer";

export interface ToNumberOptions extends AcquireTransformerOptions {
  decimalSeparator?: string;
  thousandsSeparator?: string;
}

export default function ToNumber(options?: ToNumberOptions): PropertyDecorator {
  const {
    fallback = null,
    classTransformOptions,
    decimalSeparator = ".",
    thousandsSeparator = ","
  } = options ?? {};

  return Transform(({ value }) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value !== "string") {
      return fallback;
    }

    const sanitizedValue = value
      .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
      .replace(new RegExp(`\\${decimalSeparator}`), ".");

    const parsed = parseFloat(sanitizedValue);

    return isNaN(parsed) ? fallback : parsed;
  }, classTransformOptions);
}
