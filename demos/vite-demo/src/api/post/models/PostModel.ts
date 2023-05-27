import { Expose } from "@acquirejs/core";

export class PostModel {
  @Expose() userId: number;
  @Expose() id: number;
  @Expose() title: string;
  @Expose() body: string;
}
