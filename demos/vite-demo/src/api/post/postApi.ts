import acquire from "../acquire";
import { CreatePostDTO } from "./dtos/CreatePostDTO";
import { PostDTO } from "./dtos/PostDTO";
import { CreatePostModel } from "./models/CreatePostModel";
import { PostModel } from "./models/PostModel";

export const getPosts = acquire
  .createRequestHandler()
  .withResponseMapping([PostModel], [PostDTO])
  .get<{
    page?: number;
    limit?: number;
    sort?: keyof PostDTO;
    order?: "asc" | "desc";
    userId?: number;
  }>({
    path: "/posts",
    params: ({ page, limit, sort, order, userId }) => ({
      _page: page,
      _limit: limit,
      _sort: sort,
      _order: order,
      userId: userId
    })
  });

export const createPost = acquire
  .createRequestHandler()
  .withRequestMapping(CreatePostModel, CreatePostDTO)
  .withResponseMapping(PostModel, PostDTO)
  .post({
    path: "/posts"
  });
