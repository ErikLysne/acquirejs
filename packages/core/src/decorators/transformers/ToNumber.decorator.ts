import { Transform } from "class-transformer";

export default function ToNumber(defaultValue?: any): PropertyDecorator {
  return Transform(({ value }) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  });
}
