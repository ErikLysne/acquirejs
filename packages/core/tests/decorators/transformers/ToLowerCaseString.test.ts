import ToLowerCaseString from "@/decorators/transformers/ToLowerCaseString.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToLowerCaseString()
  value: string;

  @ToLowerCaseString({
    fallback: "default"
  })
  valueWithFallback: string;
}

function getTransformedValue(key: keyof TestClass, value: any): string {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToLowerCaseString", () => {
  it("should transform a string to lowercase", () => {
    expect(getTransformedValue("value", "TEST")).toEqual("test");
  });

  it("should transform a number to lowercase string", () => {
    expect(getTransformedValue("value", 123)).toEqual("123");
  });

  it("should transform a boolean to lowercase string", () => {
    expect(getTransformedValue("value", true)).toEqual("true");
  });

  it("should transform an array to lowercase string", () => {
    expect(getTransformedValue("value", ["A", "B", "C"])).toEqual("a,b,c");
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
