import { demoUser } from "../populateMockCache";
import { createComment, getComments } from "./commentApi";
import { CommentDTO } from "./dtos/CommentDTO";

getComments.setMockInterceptor(
  async ({ mockResponse, mockCache, callArgs, delay }) => {
    const { postId, order, sort } = callArgs ?? {};

    const dbSimulator = mockCache?.createDatabaseSimulator(CommentDTO);
    const data = dbSimulator
      ?.sort(sort, order)
      .filter((comment) => comment.postId === postId)
      .get();

    mockResponse.data = data;

    await delay(100, 350);
    return Promise.resolve(mockResponse);
  }
);

createComment.setMockInterceptor(async ({ mockResponse, mockCache, delay }) => {
  const dbSimulator = mockCache?.createDatabaseSimulator(CommentDTO);
  const id = dbSimulator?.generateNextID();

  const newComment: CommentDTO = {
    ...mockResponse.config?.data,
    id,
    name: demoUser.name
  };

  dbSimulator?.create(newComment);

  mockResponse.data = newComment;

  await delay(100, 200);
  return Promise.resolve(mockResponse);
});
