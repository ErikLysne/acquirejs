import ToNumber from "@/decorators/transformers/ToNumber.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToNumber()
  value: number;

  @ToNumber({ fallback: 10 })
  valueWithFallback: number;

  @ToNumber({
    fallback: 10,
    decimalSeparator: ",",
    thousandsSeparator: "_"
  })
  valueWithSeparators: number;
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

  it("should transform to null if the transformation fails and no fallback is set", () => {
    expect(getTransformedValue("value", undefined)).toBeNull();
    expect(getTransformedValue("value", "not a number")).toBeNull();
    expect(getTransformedValue("value", true)).toBeNull();
  });

  it("should transform invalid values to the fallback", () => {
    expect(getTransformedValue("valueWithFallback", "invalid")).toBe(10);
  });

  it("should not overwrite a valid number with the fallback", () => {
    expect(getTransformedValue("valueWithFallback", 123)).toBe(123);
  });

  it("should transform a string with custom separators to a number", () => {
    expect(getTransformedValue("valueWithSeparators", "1_234,56")).toBeCloseTo(
      1234.56
    );
  });

  it("should transform a string with custom thousands separator to a number", () => {
    expect(getTransformedValue("valueWithSeparators", "1_234")).toEqual(1234);
  });

  it("should transform a string with custom decimal separator to a number", () => {
    expect(getTransformedValue("valueWithSeparators", "123,456")).toBeCloseTo(
      123.456
    );
  });
});
