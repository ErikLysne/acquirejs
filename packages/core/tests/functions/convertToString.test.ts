import convertToString from "@/functions/convertToString.function";

describe("function: convertToString", () => {
  it("should convert a string to a string", () => {
    expect(convertToString("test")).toEqual("test");
  });

  it("should convert a number to a string", () => {
    expect(convertToString(123)).toEqual("123");
  });

  it("should convert a boolean to a string", () => {
    expect(convertToString(true)).toEqual("true");
  });

  it("should convert an object with a custom toString to a string", () => {
    const obj = {
      toString: (): string => "custom string"
    };
    expect(convertToString(obj)).toEqual("custom string");
  });

  it("should convert an array to a string", () => {
    expect(convertToString([1, 2, 3])).toEqual("1,2,3");
  });

  it("should return null for objects without a toString method", () => {
    expect(convertToString({})).toBeNull();
  });

  it("should return null for a null value", () => {
    expect(convertToString(null)).toBeNull();
  });

  it("should return null for an undefined value", () => {
    expect(convertToString(undefined)).toBeNull();
  });
});
