import convertToString from "@/functions/convertToString.function";
import { Transform } from "class-transformer";

export default function Trim(options?: {
  defaultValue?: any;
}): PropertyDecorator {
  return Transform(
    ({ value }) => convertToString(value)?.trim() || options?.defaultValue
  );
}
