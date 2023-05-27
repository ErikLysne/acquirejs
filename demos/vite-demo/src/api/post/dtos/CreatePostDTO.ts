import { Expose } from "@acquirejs/core";

export class CreatePostDTO {
  @Expose() userId?: number;
  @Expose() title: string;
  @Expose() body: string;
}
