import { demoUser } from "../populateMockCache";
import { createComment, getComments } from "./commentApi";
import { CommentDTO } from "./dtos/CommentDTO";

getComments.useOnMocking(({ response, mockCache, callArgs }) => {
  const { postId, order, sort } = callArgs ?? {};

  const dbSimulator = mockCache?.createDatabaseSimulator(CommentDTO);
  const data = dbSimulator
    ?.sort(sort, order)
    .filter((comment) => comment.postId === postId)
    .get();

  response.data = data;
});

createComment.useOnMocking(({ response, mockCache }) => {
  const dbSimulator = mockCache?.createDatabaseSimulator(CommentDTO);
  const id = dbSimulator?.generateNextID();

  const newComment: CommentDTO = {
    ...response.config?.data,
    id,
    name: demoUser.name
  };

  dbSimulator?.create(newComment);

  response.data = newComment;
});
