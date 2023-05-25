import { CallableInstance } from "@/classes/CallableInstance.class";

interface TestCallableInstance {
  (x: number): number;
}

class TestCallableInstance extends CallableInstance {
  private value = 10;

  constructor() {
    super((x: number) => this.add(x));
  }

  public add(x: number): number {
    return this.value + x;
  }
}

describe("class: CallableInstance", () => {
  it("should correctly call the callback", () => {
    const callable = new TestCallableInstance();
    expect(callable(5)).toBe(15);
  });
});
