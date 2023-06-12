import ToDate from "@/decorators/transformers/ToDate.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToDate()
  value: Date;

  @ToDate({ fallback: "invalid date" })
  valueWithFallback: Date | "invalid date";
}

function getTransformedValue<TKey extends keyof TestClass>(
  key: TKey,
  value: any
): TKey extends "value" ? Date : Date | string {
  return plainToInstance(TestClass, { [key]: value })[key] as Date;
}

describe("decorator: ToDate", () => {
  it("should transform a valid string date to a Date object", () => {
    expect(getTransformedValue("value", "2023-05-25")).toBeInstanceOf(Date);
  });

  it("should transform a valid string date with time to a Date object", () => {
    expect(getTransformedValue("value", "2023-05-25T10:30:00Z")).toBeInstanceOf(
      Date
    );
  });

  it("should transform a valid timestamp number to a Date object", () => {
    expect(getTransformedValue("value", 1621939200000)).toBeInstanceOf(Date);
  });

  it("should transform a valid Date object to the same date", () => {
    const date = new Date();
    expect(getTransformedValue("value", date).getTime()).toEqual(
      date.getTime()
    );
  });

  it("should transform to null if the transformation fails and no fallback is set", () => {
    expect(getTransformedValue("value", "invalid")).toBeNull();
    expect(getTransformedValue("value", "1234567890")).toBeNull();
    expect(getTransformedValue("value", true)).toBeNull();
  });

  it("should transform invalid values to the fallback", () => {
    expect(getTransformedValue("valueWithFallback", "invalid")).toEqual(
      "invalid date"
    );
    expect(getTransformedValue("valueWithFallback", "1234567890")).toEqual(
      "invalid date"
    );
    expect(getTransformedValue("valueWithFallback", true)).toEqual(
      "invalid date"
    );
  });
});
