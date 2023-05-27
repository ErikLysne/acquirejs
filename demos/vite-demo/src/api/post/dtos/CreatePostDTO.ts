import { Expose } from "@acquire/core";

export class CreatePostDTO {
  @Expose() userId?: number;
  @Expose() title: string;
  @Expose() body: string;
}
