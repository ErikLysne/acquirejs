import AcuireDatabaseSimulator from "@/classes/AcquireDatabaseSimulator.class";
import AcquireMockCache from "@/classes/AcquireMockCache.class";
import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import MockID from "@/decorators/mocks/MockID.decorator";
import generateMock from "@/functions/generateMock.function";

class User {
  constructor(public id: number, public name: string, public age: number) {}
}

describe("class: AcuireDatabaseSimulator", () => {
  let cache: AcquireMockCache;
  let simulator: AcuireDatabaseSimulator<User>;

  beforeEach(() => {
    cache = new AcquireMockCache();
    const users = [
      new User(1, "Alice", 30),
      new User(2, "Bob", 35),
      new User(3, "Charlie", 25)
    ];

    cache.add(User, users[0]);
    cache.add(User, users[1]);
    cache.add(User, users[2]);

    simulator = cache.createDatabaseSimulator(User);

    acquireMockDataStorage.clearAll();
  });

  describe("function: sort", () => {
    it("should sort in ascending order by default", () => {
      const sortedUsers = simulator.sort("age").get();
      expect(sortedUsers[0].name).toEqual("Charlie");
      expect(sortedUsers[1].name).toEqual("Alice");
      expect(sortedUsers[2].name).toEqual("Bob");
    });

    it("should sort in descending order when direction is 'desc'", () => {
      const sortedUsers = simulator.sort("age", "desc").get();
      expect(sortedUsers[0].name).toEqual("Bob");
      expect(sortedUsers[1].name).toEqual("Alice");
      expect(sortedUsers[2].name).toEqual("Charlie");
    });
  });

  describe("function: filter", () => {
    it("should filter users", () => {
      const filteredUsers = simulator.filter((user) => user.age > 30).get();
      expect(filteredUsers.length).toEqual(1);
      expect(filteredUsers[0].name).toEqual("Bob");
    });
  });

  describe("function: paginate", () => {
    it("should paginate users", () => {
      const page1 = simulator.paginate(0, 2).get();
      expect(page1.length).toEqual(2);
      expect(page1[0].name).toEqual("Alice");
      expect(page1[1].name).toEqual("Bob");

      simulator.reset();

      const page2 = simulator.paginate(1, 2).get();
      expect(page2.length).toEqual(1);
      expect(page2[0].name).toEqual("Charlie");
    });
  });

  describe("function: search", () => {
    it("should search users", () => {
      const searchedUsersByName = simulator.search("Ali", ["name"]).get();
      expect(searchedUsersByName.length).toEqual(1);
      expect(searchedUsersByName[0].name).toEqual("Alice");

      simulator.reset();

      const searchedUsersByAge = simulator.search("3", ["age"]).get();
      expect(searchedUsersByAge.length).toEqual(2);
      expect(searchedUsersByAge[0].name).toEqual("Alice");
      expect(searchedUsersByAge[1].name).toEqual("Bob");
    });
  });

  describe("filter chaining", () => {
    it("should be possible to chain multiple filters together", () => {
      const searchedAndFilteredUsers = simulator
        .filter((user) => user.id > 1)
        .search("Bob", ["name"])
        .get();
      expect(searchedAndFilteredUsers.length).toEqual(1);
    });
  });

  describe("function: generateNextID", () => {
    it("should generate the next ID when no generator is specified", async () => {
      class TestClass {
        @MockID() id: number;
      }

      const simulator = cache.createDatabaseSimulator(TestClass);

      const testInstance1 = await generateMock(TestClass);
      const nextID = simulator.generateNextID();
      const testInstance2 = await generateMock(TestClass);

      expect(testInstance1.id).toEqual(1);
      expect(nextID).toEqual(2);
      expect(testInstance2.id).toEqual(3);
    });

    it("should generate the next ID when a generator is specified", async () => {
      let IDHead = 10;

      class TestClass {
        @MockID(() => IDHead++) id: number;
      }

      const simulator = cache.createDatabaseSimulator(TestClass);

      const testInstance1 = await generateMock(TestClass);
      const nextID = simulator.generateNextID();
      const testInstance2 = await generateMock(TestClass);

      expect(testInstance1.id).toEqual(10);
      expect(nextID).toEqual(11);
      expect(testInstance2.id).toEqual(12);
    });
  });

  describe("function: find", () => {
    it("should find the right user", () => {
      const user = simulator.find((user) => user.id === 2);
      expect(user?.name).toEqual("Bob");
    });
  });

  describe("function: create", () => {
    it("should create a user", () => {
      const newUser = new User(4, "David", 40);
      simulator.create(newUser);
      expect(simulator.filter((user) => user.id === 4).get().length).toEqual(1);
    });
  });

  describe("function: update", () => {
    it("should update the user", () => {
      const updatedUser = simulator.update(1, { name: "Alicia" });
      expect(updatedUser?.name).toEqual("Alicia");
      expect(
        simulator.filter((user) => user.name === "Alicia").get().length
      ).toEqual(1);
      expect(simulator.count()).toEqual(3);
    });
  });

  describe("function: delete", () => {
    it("should delete the user", () => {
      const wasDeleted = simulator.delete(1);
      expect(wasDeleted).toBe(true);
      expect(simulator.filter((user) => user.id === 1).get().length).toEqual(0);
    });
  });

  describe("function: count", () => {
    it("should return the number of users", () => {
      const count = simulator.count();
      expect(count).toEqual(3);
    });
  });
});
