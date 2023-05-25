import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import MockID from "@/decorators/mocks/MockID.decorator";
import generateMock from "@/functions/generateMock.function";

describe("decorator: MockID", () => {
  beforeEach(() => {
    acquireMockDataStorage.clearAll();
  });

  it("should add the property key to the mockIDDecoratorMap", () => {
    class TestDTO {
      @MockID() id: number;
    }

    expect(acquireMockDataStorage.mockIDDecoratorMap.get(TestDTO)).toEqual(
      "id"
    );
  });

  it("should log an error to the console if duplicate MockIDs are detected and keep only the first encountered", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    class TestDTO {
      @MockID() id1: number;
      @MockID() id2: string;
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Duplicate 'MockID' decorators are not allowed. 'MockID' has already been set for 'id1'."
      )
    );
    expect(acquireMockDataStorage.mockIDDecoratorMap.get(TestDTO)).toEqual(
      "id1"
    );
  });

  it("should generate consecutive IDs if no generator is provided", async () => {
    class TestDTO1 {
      @MockID() id: number;
    }

    class TestDTO2 {
      @MockID() id: number;
    }

    const testDTO11 = await generateMock(TestDTO1);
    const testDTO12 = await generateMock(TestDTO1);
    const testDTO13 = await generateMock(TestDTO1);

    const testDTO21 = await generateMock(TestDTO2);
    const testDTO22 = await generateMock(TestDTO2);
    const testDTO23 = await generateMock(TestDTO2);

    expect(testDTO11.id).toEqual(1);
    expect(testDTO12.id).toEqual(2);
    expect(testDTO13.id).toEqual(3);

    expect(testDTO21.id).toEqual(1);
    expect(testDTO22.id).toEqual(2);
    expect(testDTO23.id).toEqual(3);
  });

  it("should use the generator to generate IDs if generator is provided", async () => {
    let id = 10;
    function generateID(): number {
      return id++;
    }
    class TestDTO {
      @MockID(generateID) id: number;
    }

    const testDTO1 = await generateMock(TestDTO);
    const testDTO2 = await generateMock(TestDTO);
    const testDTO3 = await generateMock(TestDTO);

    expect(testDTO1.id).toEqual(10);
    expect(testDTO2.id).toEqual(11);
    expect(testDTO3.id).toEqual(12);
  });
});
