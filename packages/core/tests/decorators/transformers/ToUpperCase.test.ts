import ToUpperCase from "@/decorators/transformers/ToUpperCase.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToUpperCase({ defaultValue: "default" })
  value: string;
}

function getUpperCasedValue(value: any): string {
  return plainToInstance(TestClass, { value })["value"];
}

describe("decorator: ToUpperCase", () => {
  it("should transform a string to uppercase", () => {
    expect(getUpperCasedValue("test")).toEqual("TEST");
  });

  it("should transform a number to uppercase string", () => {
    expect(getUpperCasedValue(123)).toEqual("123");
  });

  it("should transform a boolean to uppercase string", () => {
    expect(getUpperCasedValue(true)).toEqual("TRUE");
  });

  it("should transform an array to uppercase string", () => {
    expect(getUpperCasedValue(["a", "b", "c"])).toEqual("A,B,C");
  });

  it("should transform null and undefined to defaultValue", () => {
    expect(getUpperCasedValue(null)).toEqual("default");
    expect(getUpperCasedValue(undefined)).toEqual("default");
  });

  it("should transform an empty string to defaultValue", () => {
    expect(getUpperCasedValue("")).toEqual("default");
  });

  it("should transform an empty object to defaultValue", () => {
    expect(getUpperCasedValue({})).toEqual("default");
  });
});
