import convertToString from "@/functions/convertToString.function";
import { Transform } from "class-transformer";

export default function ToLowerCase(defaultValue?: any): PropertyDecorator {
  return Transform(
    ({ value }) => convertToString(value)?.toLowerCase() || defaultValue
  );
}
