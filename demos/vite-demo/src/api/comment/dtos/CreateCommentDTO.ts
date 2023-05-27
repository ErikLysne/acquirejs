import { Expose } from "@acquire/core";

export class CreateCommentDTO {
  @Expose() postId: number;
  @Expose() name?: string;
  @Expose() email?: string;
  @Expose() body: string;
}
