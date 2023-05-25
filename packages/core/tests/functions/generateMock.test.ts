import AcquireMockCache from "@/classes/AcquireMockCache.class";
import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import MockID from "@/decorators/mocks/MockID.decorator";
import MockRelationID from "@/decorators/mocks/MockRelationID.decorator";
import MockRelationProperty from "@/decorators/mocks/MockRelationProperty.decorator";
import generateMock from "@/functions/generateMock.function";
import { Chance } from "chance";

const chance = new Chance();
const mockCache = new AcquireMockCache();

describe("function: generateMock", () => {
  beforeEach(() => {
    mockCache.clear();
    acquireMockDataStorage.clearAll();
  });

  it("should create a mock object from the Mock decorators", async () => {
    class UserDTO {
      @Mock(10) id: number;
      @Mock("Christian Bale") name: string;
      @Mock(49) age: number;
    }

    const user = await generateMock(UserDTO);

    expect(user.id).toEqual(10);
    expect(user.name).toEqual("Christian Bale");
    expect(user.age).toEqual(49);
  });

  it("should create a mock object from the Mock decorators using callbacks", async () => {
    class UserDTO {
      @Mock(() => 10) id: number;
      @Mock(() => "Christian Bale") name: string;
      @Mock(() => 49) age: number;
    }

    const user = await generateMock(UserDTO);

    expect(user.id).toEqual(10);
    expect(user.name).toEqual("Christian Bale");
    expect(user.age).toEqual(49);
  });

  it("should create a mock object from the Mock decorators using async callbacks", async () => {
    class UserDTO {
      @Mock(async () => Promise.resolve(10)) id: number;
      @Mock(async () => Promise.resolve("Christian Bale")) name: string;
      @Mock(async () => Promise.resolve(49)) age: number;
    }

    const user = await generateMock(UserDTO);

    expect(user.id).toEqual(10);
    expect(user.name).toEqual("Christian Bale");
    expect(user.age).toEqual(49);
  });

  it("should create an array of mock objects if 'count' is specified", async () => {
    class UserDTO {
      @Mock(10) id: number;
      @Mock("Christian Bale") name: string;
      @Mock(49) age: number;
    }

    const users = await generateMock(UserDTO, 15);

    expect(users.length).toEqual(15);
    users.forEach((user) => {
      expect(user.id).toEqual(10);
      expect(user.name).toEqual("Christian Bale");
      expect(user.age).toEqual(49);
    });
  });

  it("should return data from the cache if cache is provided and MockID and MockRelationID decorators are present", async () => {
    class PostDTO {
      @MockID() id: number;
    }

    class CommentDTO {
      @MockRelationID(() => PostDTO) postId: number;
    }

    const posts = await mockCache.fill(PostDTO, 5);
    const comment = await generateMock(CommentDTO, undefined, mockCache);

    const expectedPostIds = [1, 2, 3, 4, 5];

    expect(posts?.map((post) => post.id)).toEqual(expectedPostIds);
    expect(expectedPostIds).toContain(comment.postId);
  });

  it("should throw an error if MockRelationID is used and the related class is missing MockID decorator", async () => {
    class PostDTO {
      id: number;
    }

    class CommentDTO {
      @MockID() id: number;
      @MockRelationID(() => PostDTO) postId: number;
    }

    expect(generateMock(CommentDTO, undefined, mockCache)).rejects.toThrow(
      "A 'MockRelationID' decorator for 'postId' was set on class 'CommentDTO' to establish a relation to class 'PostDTO', but class 'PostDTO' is missing required 'MockID' decorator."
    );
  });

  it("should throw an error if MockRelationID is used and the related class missing from the mock cache", async () => {
    class PostDTO {
      @MockID() id: number;
    }

    class CommentDTO {
      @MockID() id: number;
      @MockRelationID(() => PostDTO) postId: number;
    }

    expect(generateMock(CommentDTO, undefined, mockCache)).rejects.toThrow(
      "Attempted to instantiate mock data for class 'CommentDTO' with relation to class 'PostDTO', but no instances of class 'PostDTO' exists in the mock cache. Consider pre-populating the cache with instances of class 'PostDTO' by calling 'mockCache.fill(PostDTO, 10)'."
    );
  });

  it("should find and add the related fields if MockID and MockRelationProperty decorators are present", async () => {
    class UserDTO {
      @MockID() id: number;
      @Mock(() => chance.name()) name: string;
    }

    class CommentDTO {
      @MockRelationID(() => UserDTO) userId: number;
      @MockRelationProperty(() => UserDTO, "name") userName: string;
    }

    const users = await mockCache.fill(UserDTO, 5);
    const comment = await generateMock(CommentDTO, undefined, mockCache);

    const expectedUserIds = [1, 2, 3, 4, 5];
    const commentingUser = users.find((user) => user.id === comment.userId);

    expect(users.map((user) => user.id)).toEqual(expectedUserIds);
    expect(comment.userId).toEqual(commentingUser?.id);
    expect(comment.userName).toEqual(commentingUser?.name);
  });
});
