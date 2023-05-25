import { Acquire } from "@/classes/Acquire.class";
import AcquireMockCache from "@/classes/AcquireMockCache.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import MockID from "@/decorators/mocks/MockID.decorator";
import { Chance } from "chance";
import { Expose } from "class-transformer";

describe("setup of mutation endpoint", () => {
  it("should correctly allow mutations to be mocked", async () => {
    const chance = new Chance();

    class PostDTO {
      @MockID() id: number;
      @Mock(() => chance.sentence()) title: string;
      @Mock(() => chance.paragraph()) text: string;
    }

    class PostModel {
      @Expose() id: number;
      @Expose() title: string;
      @Expose() text: string;
    }

    class CreatePostDTO {
      @Expose() title: string;
      @Expose() text: string;
    }

    class CreatePostModel {
      title: string;
      text: string;
    }

    const mockCache = new AcquireMockCache();
    const acquire = new Acquire().useMockCache(mockCache).enableMocking();

    await mockCache.fill(PostDTO, 15);

    const createPost = acquire({
      request: {
        url: "https://www.example.com/users",
        method: "POST"
      },
      requestMapping: {
        DTO: CreatePostDTO,
        Model: CreatePostModel
      },
      responseMapping: {
        DTO: PostDTO,
        Model: PostModel
      }
    });

    createPost.setMockInterceptor(async ({ mockResponse, mockCache }) => {
      const data = mockResponse.config?.data;

      const dbSimulator = mockCache?.createDatabaseSimulator(PostDTO);
      const id = dbSimulator?.generateNextID();
      const newPost = { ...data, id };
      dbSimulator?.create(newPost);

      mockResponse.data = newPost;

      return Promise.resolve(mockResponse);
    });

    const response = await createPost({
      data: {
        title: "My title",
        text: "My text"
      }
    });

    expect(response.model).toBeInstanceOf(PostModel);
    expect(response.model.title).toEqual("My title");
    expect(response.model.text).toEqual("My text");
    expect(response.model.id).toEqual(16);
  });
});
