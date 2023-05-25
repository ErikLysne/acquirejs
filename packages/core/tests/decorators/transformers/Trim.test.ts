import Trim from "@/decorators/transformers/Trim.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @Trim("default") value: string;
}

function getTrimmedValue(value: any): string {
  return plainToInstance(TestClass, { value })["value"];
}

describe("decorator: Trim", () => {
  it("should trim leading and trailing whitespaces", () => {
    expect(getTrimmedValue("   hello world   ")).toEqual("hello world");
  });

  it("should preserve internal whitespaces", () => {
    expect(getTrimmedValue("  hello   world  ")).toEqual("hello   world");
  });

  it("should transform only whitespaces to defaultValue", () => {
    expect(getTrimmedValue("     ")).toEqual("default");
  });

  it("should transform null and undefined to defaultValue", () => {
    expect(getTrimmedValue(null)).toEqual("default");
    expect(getTrimmedValue(undefined)).toEqual("default");
  });

  it("should transform an empty string to defaultValue", () => {
    expect(getTrimmedValue("")).toEqual("default");
  });

  it("should transform an empty object to defaultValue", () => {
    expect(getTrimmedValue({})).toEqual("default");
  });
});
