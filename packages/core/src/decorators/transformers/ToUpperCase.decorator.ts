import convertToString from "@/functions/convertToString.function";
import { Transform } from "class-transformer";

export default function ToUpperCase(options?: {
  defaultValue?: any;
}): PropertyDecorator {
  return Transform(
    ({ value }) =>
      convertToString(value)?.toUpperCase() || options?.defaultValue
  );
}
