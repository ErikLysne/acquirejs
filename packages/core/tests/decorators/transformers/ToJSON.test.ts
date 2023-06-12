import ToJSON from "@/decorators/transformers/ToJSON.decorator";
import { plainToInstance } from "class-transformer";

class TestClass {
  @ToJSON()
  value: any;
}

function getTransformedValue(key: keyof TestClass, value: any): any {
  return plainToInstance(TestClass, { [key]: value })[key];
}

describe("decorator: ToJSON", () => {
  it("should transform an object to a JSON string", () => {
    expect(getTransformedValue("value", { a: 1, b: 2 })).toEqual(
      JSON.stringify({ a: 1, b: 2 })
    );
  });

  it("should transform an array to a JSON array", () => {
    expect(getTransformedValue("value", ["A", "B", "C"])).toEqual(
      JSON.stringify(["A", "B", "C"])
    );
  });
});
