import { Transform } from "class-transformer";

export default function ToBoolean(
  falsyValues: any[] = [false, undefined, null, 0, NaN, "false", "0", ""]
): PropertyDecorator {
  const falsySet = new Set(falsyValues.filter((val) => !Number.isNaN(val)));
  const shouldTreatNaNAsFalsy = falsyValues.some(Number.isNaN);

  return Transform(({ value }) => {
    if (typeof value === "number" && isNaN(value)) {
      return !shouldTreatNaNAsFalsy;
    }
    return !falsySet.has(value);
  });
}
