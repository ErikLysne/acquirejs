import { demoUser } from "../populateMockCache";
import { PostDTO } from "./dtos/PostDTO";
import { createPost, getPosts } from "./postApi";

getPosts.useOnMocking(({ response, mockCache, callArgs }) => {
  const { userId, page, limit, order, sort } = callArgs ?? {};

  const dbSimulator = mockCache!.createDatabaseSimulator(PostDTO);
  const data = dbSimulator
    .filter(userId ? (post) => post.userId === userId : undefined)
    .sort(sort, order)
    .paginate(page, limit, 1)
    .get();

  response.data = data;
  response.headers = {
    ...response.headers,
    ["x-total-count"]: dbSimulator.count()
  };
});

createPost.useOnMocking(({ response, mockCache }) => {
  const dbSimulator = mockCache!.createDatabaseSimulator(PostDTO);
  const id = dbSimulator.generateNextID();

  const newPost: PostDTO = {
    ...response.config.data,
    id,
    userId: demoUser.id
  };

  dbSimulator?.create(newPost);

  response.data = newPost;
});
