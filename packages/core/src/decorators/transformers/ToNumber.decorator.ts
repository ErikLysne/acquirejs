import { Transform } from "class-transformer";

export default function ToNumber(options?: {
  defaultValue?: any;
}): PropertyDecorator {
  return Transform(({ value }) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? options?.defaultValue : parsed;
  });
}
