import { Acquire } from "@/classes/Acquire.class";
import AcquireMockCache from "@/classes/AcquireMockCache.class";
import axios from "axios";
import { Expose } from "class-transformer";

describe("Setup of endpoint with intercepting middleware", () => {
  it("should correctly mock the request, using the middleware to customize the returned data", async () => {
    /* ---------------------------------- Setup --------------------------------- */

    class UserDTO {
      constructor(public id: number, public name: string, public age: number) {}
    }

    const users: UserDTO[] = [
      new UserDTO(1, "Alice", 30),
      new UserDTO(2, "Bob", 35),
      new UserDTO(3, "Charlie", 25),
      new UserDTO(4, "David", 40),
      new UserDTO(5, "Evelyn", 32),
      new UserDTO(6, "Frank", 29),
      new UserDTO(7, "Grace", 34),
      new UserDTO(8, "Harry", 28),
      new UserDTO(9, "Isla", 27),
      new UserDTO(10, "Bobby", 36)
    ];

    class UserModel {
      @Expose() id: number;
      @Expose() name: string;
      @Expose() age: number;
    }

    const mockCache = new AcquireMockCache();
    const acquire = new Acquire(axios).useMockCache(mockCache).enableMocking();

    users.forEach((user) => mockCache.add(UserDTO, user));
    /* -------------------------------------------------------------------------- */

    /* ---------------------------- Define API method --------------------------- */

    const getUsers = acquire.withCallArgs<{
      sortBy?: keyof UserDTO;
      sortByDescending?: boolean;
      search?: string;
      minAge?: number;
      maxAge?: number;
    }>()({
      request: {
        url: "https://example.com/users",
        params: (args) => ({
          sortBy: args?.sortBy,
          sortByDescending: args?.sortByDescending,
          search: args?.search,
          maxAge: args?.maxAge
        })
      },
      responseMapping: {
        DTO: [UserDTO],
        Model: [UserModel]
      }
    });
    /* -------------------------------------------------------------------------- */

    /* ---------------------------- Setup mock logic ---------------------------- */

    getUsers.use(({ response, mockCache, callArgs }) => {
      const { sortBy, sortByDescending, search, minAge, maxAge } =
        callArgs ?? {};

      const dbSimulator = mockCache!.createDatabaseSimulator(UserDTO);
      const data = dbSimulator
        .sort(sortBy, sortByDescending ? "desc" : "asc")
        .search(search, ["name"])
        .filter(minAge ? (user): boolean => user.age >= minAge : undefined)
        .filter(maxAge ? (user): boolean => user.age <= maxAge : undefined)
        .get();

      response.data = data;
    });

    /* -------------------------------------------------------------------------- */

    /* ------------------------------ Test function ----------------------------- */

    const allUsers = await getUsers();
    expect(allUsers.model.length).toEqual(10);

    const searchedUsers = await getUsers({ search: "Bob" });
    expect(searchedUsers.model.length).toEqual(2);

    const filteredUsersByMinAge = await getUsers({
      minAge: 30
    });
    expect(filteredUsersByMinAge.model.length).toEqual(6);

    const filteredUsersByMaxAge = await getUsers({
      maxAge: 30
    });
    expect(filteredUsersByMaxAge.model.length).toEqual(5);

    const filteredUsersByAgeRange = await getUsers({
      minAge: 30,
      maxAge: 35
    });
    expect(filteredUsersByAgeRange.model.length).toEqual(4);

    const filteredAndSortedUsersByMaxAge = await getUsers({
      maxAge: 30,
      sortBy: "age",
      sortByDescending: false
    });
    expect(filteredAndSortedUsersByMaxAge.model.length).toEqual(5);
    expect(filteredAndSortedUsersByMaxAge.model[0].name).toEqual("Charlie");
    expect(filteredAndSortedUsersByMaxAge.model[1].name).toEqual("Isla");
    expect(filteredAndSortedUsersByMaxAge.model[2].name).toEqual("Harry");
    expect(filteredAndSortedUsersByMaxAge.model[3].name).toEqual("Frank");
    expect(filteredAndSortedUsersByMaxAge.model[4].name).toEqual("Alice");

    /* -------------------------------------------------------------------------- */
  });
});
