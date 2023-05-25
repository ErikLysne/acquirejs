import { Transform } from "class-transformer";

export default function ToDate(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  });
}
