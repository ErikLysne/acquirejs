import ToString from "@/decorators/transformers/ToString.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToString()
  value: string;

  @ToString({ defaultValue: "default" })
  valueWithDefault: string;
}

class CustomToString {
  constructor(private value: string) {}

  toString(): string {
    return `Custom toString: ${this.value}`;
  }
}

function getTransformedValue(key: keyof TestClass, value: any): string {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToString", () => {
  it("should transform a number to a string", () => {
    expect(getTransformedValue("value", 123)).toEqual("123");
    expect(getTransformedValue("value", 123.456)).toEqual("123.456");
  });

  it("should transform a boolean to a string", () => {
    expect(getTransformedValue("value", true)).toEqual("true");
    expect(getTransformedValue("value", false)).toEqual("false");
  });

  it("should keep string as string", () => {
    expect(getTransformedValue("value", "hello")).toEqual("hello");
  });

  it("should transform null and undefined to defaultValue", () => {
    expect(getTransformedValue("valueWithDefault", null)).toEqual("default");
    expect(getTransformedValue("valueWithDefault", undefined)).toEqual(
      "default"
    );
  });

  it("should transform an empty string to defaultValue", () => {
    expect(getTransformedValue("valueWithDefault", "")).toEqual("default");
  });

  it("should transform [object Object] to defaultValue", () => {
    expect(getTransformedValue("valueWithDefault", {})).toEqual("default");
  });

  it("should transform an object with toString method to a string", () => {
    const customToString = new CustomToString("hello");
    expect(getTransformedValue("value", customToString)).toEqual(
      "Custom toString: hello"
    );
  });

  it("should use the default value for objects with non-meaningful toString output", () => {
    const customToString = { toString: (): string => "" };
    expect(getTransformedValue("valueWithDefault", customToString)).toEqual(
      "default"
    );
  });
});
