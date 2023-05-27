import acquire from "../acquire";
import { CreatePostDTO } from "./dtos/CreatePostDTO";
import { PostDTO } from "./dtos/PostDTO";
import { CreatePostModel } from "./models/CreatePostModel";
import { PostModel } from "./models/PostModel";

export const getPosts = acquire.withCallArgs<{
  page?: number;
  limit?: number;
  sort?: keyof PostDTO;
  order?: "asc" | "desc";
  userId?: number;
}>()({
  request: {
    path: "/posts",
    params: (args) => ({
      _page: args?.page,
      _limit: args?.limit,
      _sort: args?.sort,
      _order: args?.order,
      userId: args?.userId
    })
  },
  responseMapping: {
    DTO: [PostDTO],
    Model: [PostModel]
  }
});

export const createPost = acquire({
  request: {
    path: "/posts",
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
