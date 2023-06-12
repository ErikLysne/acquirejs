import ToUpperCaseString from "@/decorators/transformers/ToUpperCaseString.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToUpperCaseString()
  value: string;

  @ToUpperCaseString({
    fallback: "default"
  })
  valueWithFallback: string;
}

function getTransformedValue(key: keyof TestClass, value: any): string {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToUpperCaseString", () => {
  it("should transform a string to uppercase", () => {
    expect(getTransformedValue("value", "test")).toEqual("TEST");
  });

  it("should transform a number to uppercase string", () => {
    expect(getTransformedValue("value", 123)).toEqual("123");
  });

  it("should transform a boolean to uppercase string", () => {
    expect(getTransformedValue("value", true)).toEqual("TRUE");
  });

  it("should transform an array to uppercase string", () => {
    expect(getTransformedValue("value", ["a", "b", "c"])).toEqual("A,B,C");
  });

  it("should transform to null when the transformation fails and no fallback is set", () => {
    expect(getTransformedValue("value", null)).toBeNull();
    expect(getTransformedValue("value", undefined)).toBeNull();
  });

  it("should transform an empty string to the fallback", () => {
    expect(getTransformedValue("valueWithFallback", "")).toEqual("default");
  });

  it("should transform an empty object to the fallback", () => {
    expect(getTransformedValue("valueWithFallback", {})).toEqual("default");
  });
});
