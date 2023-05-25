import ToLowerCase from "@/decorators/transformers/ToLowerCase.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToLowerCase("default")
  value: string;
}

function getLowerCasedValue(value: any): string {
  return plainToInstance(TestClass, { value })["value"];
}

describe("decorator: ToLowerCase", () => {
  it("should transform a string to lowercase", () => {
    expect(getLowerCasedValue("TEST")).toEqual("test");
  });

  it("should transform a number to lowercase string", () => {
    expect(getLowerCasedValue(123)).toEqual("123");
  });

  it("should transform a boolean to lowercase string", () => {
    expect(getLowerCasedValue(true)).toEqual("true");
  });

  it("should transform an array to lowercase string", () => {
    expect(getLowerCasedValue(["A", "B", "C"])).toEqual("a,b,c");
  });

  it("should transform null and undefined to defaultValue", () => {
    expect(getLowerCasedValue(null)).toEqual("default");
    expect(getLowerCasedValue(undefined)).toEqual("default");
  });

  it("should transform an empty string to defaultValue", () => {
    expect(getLowerCasedValue("")).toEqual("default");
  });

  it("should transform an empty object to defaultValue", () => {
    expect(getLowerCasedValue({})).toEqual("default");
  });
});
