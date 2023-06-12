import ToTrimmedString from "@/decorators/transformers/ToTrimmedString.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToTrimmedString() value: string;

  @ToTrimmedString({ fallback: "default" }) valueWithFallback: string;
}

function getTransformedValue(key: keyof TestClass, value: any): string {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToTrimmedString", () => {
  it("should trim leading and trailing whitespaces", () => {
    expect(getTransformedValue("value", "   hello world   ")).toEqual(
      "hello world"
    );
  });

  it("should preserve internal whitespaces", () => {
    expect(getTransformedValue("value", "  hello   world  ")).toEqual(
      "hello   world"
    );
  });

  it("should transform to null if the transformation fails and no fallback is set", () => {
    expect(getTransformedValue("value", null)).toBeNull();
    expect(getTransformedValue("value", undefined)).toBeNull();
  });

  it("should transform only whitespaces to the fallback", () => {
    expect(getTransformedValue("valueWithFallback", "     ")).toEqual(
      "default"
    );
  });

  it("should transform an empty string to the fallback", () => {
    expect(getTransformedValue("valueWithFallback", "")).toEqual("default");
  });

  it("should transform an empty object to defaultValue", () => {
    expect(getTransformedValue("valueWithFallback", {})).toEqual("default");
  });
});
