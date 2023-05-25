import ToNumber from "@/decorators/transformers/ToNumber.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToNumber()
  value: number;

  @ToNumber(10)
  valueWithDefault: number;
}

function getTransformedValue(key: keyof TestClass, value: any): number {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToNumber", () => {
  it("should transform a string number to a number", () => {
    expect(getTransformedValue("value", "123")).toEqual(123);
  });

  it("should transform a string float to a number", () => {
    expect(getTransformedValue("value", "123.456")).toBeCloseTo(123.456);
  });

  it("should transform a valid number to a number", () => {
    expect(getTransformedValue("value", 456)).toEqual(456);
  });

  it("should transform a valid float to a number", () => {
    expect(getTransformedValue("value", 456.789)).toBeCloseTo(456.789);
  });

  it("should transform an invalid string number to undefined", () => {
    expect(getTransformedValue("value", "not a number")).toBeUndefined();
  });

  it("should transform a boolean to undefined", () => {
    expect(getTransformedValue("value", true)).toBeUndefined();
  });

  it("should transform a null value to undefined", () => {
    expect(getTransformedValue("value", null)).toBeUndefined();
  });

  it("should transform invalid values to default value", () => {
    expect(getTransformedValue("valueWithDefault", "invalid")).toBe(10);
  });

  it("should not overwrite a valid number with the default value", () => {
    expect(getTransformedValue("valueWithDefault", 123)).toBe(123);
  });
});
