import ToBoolean from "@/decorators/transformers/ToBoolean.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToBoolean() value: boolean;

  @ToBoolean({
    falsyValues: [false, undefined]
  })
  valueWithCustom: boolean;
}

function getTransformedValue(key: keyof TestClass, value: any): boolean {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToBoolean", () => {
  it("should transform a falsy value to false", () => {
    expect(getTransformedValue("value", false)).toBe(false);
    expect(getTransformedValue("value", undefined)).toBe(false);
    expect(getTransformedValue("value", null)).toBe(false);
    expect(getTransformedValue("value", 0)).toBe(false);
    expect(getTransformedValue("value", NaN)).toBe(false);
    expect(getTransformedValue("value", "false")).toBe(false);
    expect(getTransformedValue("value", "0")).toBe(false);
    expect(getTransformedValue("value", "")).toBe(false);
  });

  it("should transform a truthy value to true", () => {
    expect(getTransformedValue("value", true)).toBe(true);
    expect(getTransformedValue("value", 123)).toBe(true);
    expect(getTransformedValue("value", "abc")).toBe(true);
  });

  it("should be possible to provide a custom falsyValues array", () => {
    expect(getTransformedValue("valueWithCustom", false)).toBe(false);
    expect(getTransformedValue("valueWithCustom", undefined)).toBe(false);
    expect(getTransformedValue("valueWithCustom", null)).toBe(true);
    expect(getTransformedValue("valueWithCustom", 0)).toBe(true);
    expect(getTransformedValue("valueWithCustom", NaN)).toBe(true);
    expect(getTransformedValue("valueWithCustom", "false")).toBe(true);
    expect(getTransformedValue("valueWithCustom", "0")).toBe(true);
    expect(getTransformedValue("valueWithCustom", "")).toBe(true);
  });

  it("should correctly handle non-string and non-number values", () => {
    expect(getTransformedValue("value", {})).toBe(true);
    expect(getTransformedValue("value", [])).toBe(true);
    expect(getTransformedValue("value", () => {})).toBe(true);
  });
});
