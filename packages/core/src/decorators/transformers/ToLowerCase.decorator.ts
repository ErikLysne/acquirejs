import convertToString from "@/functions/convertToString.function";
import { Transform } from "class-transformer";

export default function ToLowerCase(options?: {
  defaultValue?: any;
}): PropertyDecorator {
  return Transform(
    ({ value }) =>
      convertToString(value)?.toLowerCase() || options?.defaultValue
  );
}
