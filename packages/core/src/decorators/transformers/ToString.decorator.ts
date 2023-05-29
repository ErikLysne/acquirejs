import convertToString from "@/functions/convertToString.function";
import { Transform } from "class-transformer";

export default function ToString(options?: {
  defaultValue?: any;
}): PropertyDecorator {
  return Transform(
    ({ value }) => convertToString(value) || options?.defaultValue
  );
}
