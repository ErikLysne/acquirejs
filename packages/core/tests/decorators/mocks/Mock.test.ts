import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import { AcquireMockGenerator } from "@/interfaces/AcquireMockGenerator.interface";

describe("decorator: Mock", () => {
  beforeEach(() => {
    acquireMockDataStorage.clearAll();
  });

  it("should add the generators to the mockDecoratorMap", () => {
    class UserDto {
      @Mock(10) id: number;
      @Mock("Christian Bale") name: string;
    }

    expect(acquireMockDataStorage.mockDecoratorMap.get(UserDto)).toEqual(
      new Map<PropertyKey, AcquireMockGenerator>([
        ["id", 10],
        ["name", "Christian Bale"]
      ])
    );
  });
});
