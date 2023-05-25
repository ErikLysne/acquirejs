import ToDate from "@/decorators/transformers/ToDate.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToDate()
  value: Date;
}

function getTransformedValue(value: any): Date {
  return plainToInstance(TestClass, { value })["value"];
}

describe("decorator: ToDate", () => {
  it("should transform a valid string date to a Date object", () => {
    expect(getTransformedValue("2023-05-25")).toBeInstanceOf(Date);
  });

  it("should transform a valid string date with time to a Date object", () => {
    expect(getTransformedValue("2023-05-25T10:30:00Z")).toBeInstanceOf(Date);
  });

  it("should transform a valid timestamp number to a Date object", () => {
    expect(getTransformedValue(1621939200000)).toBeInstanceOf(Date);
  });

  it("should transform a valid Date object to the same date", () => {
    const date = new Date();
    expect(getTransformedValue(date).getTime()).toEqual(date.getTime());
  });

  it("should transform an invalid string date to null", () => {
    expect(getTransformedValue("invalid")).toBeNull();
  });

  it("should transform an invalid timestamp number to null", () => {
    expect(getTransformedValue("1234567890")).toBeNull();
  });

  it("should transform an invalid value to null", () => {
    expect(getTransformedValue(true)).toBeNull();
  });
});
