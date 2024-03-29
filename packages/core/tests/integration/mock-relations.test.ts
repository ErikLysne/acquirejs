import { Acquire } from "@/classes/Acquire.class";
import AcquireMockCache from "@/classes/AcquireMockCache.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import MockID from "@/decorators/mocks/MockID.decorator";
import MockRelationID from "@/decorators/mocks/MockRelationID.decorator";
import MockRelationProperty from "@/decorators/mocks/MockRelationProperty.decorator";
import { Chance } from "chance";
import { Expose } from "class-transformer";

describe("setup of endpoint with mocked relations", () => {
  const chance = new Chance();

  class UserDTO {
    @MockID() id: number;
    @Mock(() => chance.name()) name: string;
    @Mock(() => chance.age()) age: number;
  }

  class PostDTO {
    @MockID() id: number;
    @Mock(() => chance.sentence()) title: string;
    @Mock(() => chance.paragraph()) text: string;
    @MockRelationID(() => UserDTO) userId: number;
    @MockRelationProperty(() => UserDTO, "name") userName: string;
  }

  class PostModel {
    @Expose() id: number;
    @Expose() title: string;
    @Expose() text: string;
    @Expose() userId: number;
    @Expose() userName: string;
  }

  const mockCache = new AcquireMockCache();
  const acquire = new Acquire().useMockCache(mockCache).enableMocking();

  const getPosts = acquire
    .createRequestHandler()
    .withResponseMapping([PostModel], [PostDTO])
    .get<{ createdByUserId?: number }>({
      url: "https://api.example.com/posts",
      params: (args) => args
    });

  beforeEach(() => {
    mockCache.clear();
    getPosts.clearMiddlewares();
  });

  it("should throw an error if no data exists in the cache", () => {
    expect(getPosts({})).rejects.toThrow(
      "Attempted to instantiate mock data for class 'PostDTO' with relation to class 'UserDTO', but no instances of class 'UserDTO' exists in the mock cache. Consider pre-populating the cache with instances of class 'UserDTO' by calling 'mockCache.fill(UserDTO, 10)'."
    );
  });

  it("should mock relations using the MockID and MockRelationID decorators when data exists in the cache", async () => {
    await mockCache.fill(UserDTO, 10);
    await mockCache.fill(PostDTO, 50);

    const posts = await getPosts.mock({}, 50);

    const users = mockCache.get(UserDTO);
    const userIds = users.map((user) => user.id);

    expect(posts.dto.length).toEqual(50);
    posts.dto.forEach((post) => {
      expect(userIds).toContainEqual(post.userId);
    });
  });

  it("should intercept the mocking and return a custom response when middleware is set", async () => {
    await mockCache.fill(UserDTO, 10);
    await mockCache.fill(PostDTO, 50);

    getPosts.use(({ callArgs, response, mockCache }) => {
      const { createdByUserId } = callArgs ?? {};

      const dbSimulator = mockCache!.createDatabaseSimulator(PostDTO);

      const data = dbSimulator
        .filter((post) => post.userId === createdByUserId)
        .get();

      response.data = data;
    });

    const posts = await getPosts({ createdByUserId: 5 });

    expect(posts.dto.every((post) => post.userId === 5));
  });
});
