import { Expose } from "@acquire/core";

export class CommentModel {
  @Expose() postId: number;
  @Expose() id: number;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() body: string;
}
