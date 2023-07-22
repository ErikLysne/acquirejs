import acquire from "../acquire";
import { CommentDTO } from "./dtos/CommentDTO";
import { CreateCommentDTO } from "./dtos/CreateCommentDTO";
import { CommentModel } from "./models/CommentModel";
import { CreateCommentModel } from "./models/CreateCommentModel";

export const getComments = acquire
  .createRequestHandler()
  .withResponseMapping([CommentModel], [CommentDTO])
  .get<{
    postId?: number;
    sort?: keyof CommentDTO;
    order?: "asc" | "desc";
  }>({
    path: "/comments",
    params: ({ postId, sort, order }) => ({
      postId: postId,
      _sort: sort,
      _order: order
    })
  });

export const createComment = acquire
  .createRequestHandler()
  .withRequestMapping(CreateCommentModel, CreateCommentDTO)
  .withResponseMapping(CommentModel, CommentDTO)
  .post({
    path: "/comments"
  });
