import AcquireMockCache from "@/classes/AcquireMockCache.class";
import generateMock from "@/functions/generateMock.function";

class MockClass {
  id: number;
  name: string;
}

jest.mock("@/functions/generateMock.function", () => jest.fn());

const mockCache = new AcquireMockCache();

describe("class: AcquireMockCache", () => {
  afterEach(() => {
    mockCache.clear();
    jest.resetAllMocks();
  });

  describe("function: fill", () => {
    it("should add multiple mock instances to the cache", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass(),
        new MockClass(),
        new MockClass(),
        new MockClass()
      ]);

      const newValues = await mockCache.fill(MockClass, 4);

      expect(newValues).toHaveLength(4);
      expect(mockCache.size(MockClass)).toEqual(4);
    });
  });

  describe("function: add", () => {
    it("should create and add a mock instance to the cache when no value is provided", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce(new MockClass());

      const newValue = await mockCache.add(MockClass);

      expect(newValue).toBeInstanceOf(MockClass);
      expect(mockCache.size(MockClass)).toEqual(1);
    });

    it("should add the value to the cache if value is specificed", async () => {
      const value = new MockClass();
      value.id = 10;
      value.name = "test";

      const newValue = await mockCache.add(MockClass, value);

      expect(newValue).toBeInstanceOf(MockClass);
      expect(newValue.id).toEqual(10);
      expect(newValue.name).toEqual("test");
      expect(mockCache.size(MockClass)).toEqual(1);
    });

    it("should not erase existing values", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass(),
        new MockClass(),
        new MockClass(),
        new MockClass()
      ]);

      await mockCache.fill(MockClass, 4);

      expect(mockCache.size(MockClass)).toEqual(4);

      await mockCache.add(MockClass, new MockClass());

      expect(mockCache.size(MockClass)).toEqual(5);
    });
  });

  describe("function; get", () => {
    it("should retrieve mock instances from the cache", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass(),
        new MockClass(),
        new MockClass(),
        new MockClass()
      ]);

      await mockCache.fill(MockClass, 4);
      const values = mockCache.get(MockClass);

      expect(values).toHaveLength(4);
    });
  });

  describe("function: remove", () => {
    it("should remove a specific mock instance from the cache", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce(new MockClass());

      const newValue = await mockCache.add(MockClass);
      mockCache.remove(MockClass, newValue);

      expect(mockCache.size(MockClass)).toEqual(0);
    });
  });

  describe("function: clear", () => {
    it("should clear the cache when called without cls", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass(),
        new MockClass(),
        new MockClass()
      ]);

      await mockCache.fill(MockClass, 3);
      mockCache.clear();

      expect(mockCache.size()).toEqual(0);
    });

    it("should clear the mock instances of the class when called with cls", async () => {
      class MockClass1 {}
      class MockClass2 {}

      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass1(),
        new MockClass1(),
        new MockClass1()
      ]);

      await mockCache.fill(MockClass1, 3);

      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass2(),
        new MockClass2(),
        new MockClass2(),
        new MockClass2()
      ]);

      await mockCache.fill(MockClass2, 4);

      expect(mockCache.size(MockClass1)).toEqual(3);
      expect(mockCache.size(MockClass2)).toEqual(4);

      mockCache.clear(MockClass1);

      expect(mockCache.size(MockClass1)).toEqual(0);
      expect(mockCache.size(MockClass2)).toEqual(4);
    });
  });

  describe("function: size", () => {
    it("should return the number of different classes when called without cls", async () => {
      class MockClass1 {}
      class MockClass2 {}
      (generateMock as jest.Mock).mockResolvedValueOnce(new MockClass1());
      await mockCache.add(MockClass1);

      (generateMock as jest.Mock).mockResolvedValueOnce(new MockClass2());
      await mockCache.add(MockClass2);

      expect(mockCache.size()).toEqual(2);
    });

    it("should return the number of class instances when called with cls", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce([
        new MockClass(),
        new MockClass(),
        new MockClass(),
        new MockClass()
      ]);

      await mockCache.fill(MockClass, 4);

      expect(mockCache.size(MockClass)).toEqual(4);
    });
  });

  describe("function: has", () => {
    it("should return true if any mock instances exist in the cache", async () => {
      (generateMock as jest.Mock).mockResolvedValueOnce(new MockClass());

      await mockCache.add(MockClass);

      expect(mockCache.has(MockClass)).toBe(true);
    });

    it("should return false if no mock instances exist in the cache", async () => {
      expect(mockCache.has(MockClass)).toBe(false);
    });
  });
});
