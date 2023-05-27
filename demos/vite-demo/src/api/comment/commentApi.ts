import acquire from "../acquire";
import { CommentDTO } from "./dtos/CommentDTO";
import { CreateCommentDTO } from "./dtos/CreateCommentDTO";
import { CommentModel } from "./models/CommentModel";
import { CreateCommentModel } from "./models/CreateCommentModel";

export const getComments = acquire.withCallArgs<{
  postId?: number;
  sort?: keyof CommentDTO;
  order?: "asc" | "desc";
}>()({
  request: {
    path: "/comments",
    params: (args) => ({
      postId: args?.postId,
      _sort: args?.sort,
      _order: args?.order
    })
  },
  responseMapping: {
    DTO: [CommentDTO],
    Model: [CommentModel]
  }
});

export const createComment = acquire({
  request: {
    path: "/comments",
    method: "POST"
  },
  requestMapping: {
    DTO: CreateCommentDTO,
    Model: CreateCommentModel
  },
  responseMapping: {
    DTO: CommentDTO,
    Model: CommentModel
  }
});
