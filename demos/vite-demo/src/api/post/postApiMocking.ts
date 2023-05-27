import { demoUser } from "../populateMockCache";
import { PostDTO } from "./dtos/PostDTO";
import { createPost, getPosts } from "./postApi";

getPosts.setMockInterceptor(
  async ({ mockResponse, mockCache, callArgs, delay }) => {
    const { userId, page, limit, order, sort } = callArgs ?? {};

    const dbSimulator = mockCache?.createDatabaseSimulator(PostDTO);
    const data = dbSimulator
      ?.filter(userId ? (post) => post.userId === userId : undefined)
      .sort(sort, order)
      .paginate(page, limit, 1)
      .get();

    mockResponse.data = data;
    mockResponse.headers = {
      ...mockResponse.headers,
      ["x-total-count"]: dbSimulator?.count()
    };

    await delay(100, 500);
    return Promise.resolve(mockResponse);
  }
);

createPost.setMockInterceptor(async ({ mockResponse, mockCache, delay }) => {
  const dbSimulator = mockCache?.createDatabaseSimulator(PostDTO);
  const id = dbSimulator?.generateNextID();

  const newPost: PostDTO = {
    ...mockResponse.config?.data,
    id,
    userId: demoUser.id
  };

  dbSimulator?.create(newPost);

  mockResponse.data = newPost;

  await delay(100, 200);

  return Promise.resolve(mockResponse);
});
