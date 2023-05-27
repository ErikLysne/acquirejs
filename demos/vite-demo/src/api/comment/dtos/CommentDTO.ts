import { MockID, MockRelationID } from "@acquirejs/core";
import { MockEmail, MockName, MockSentence } from "@acquirejs/mocks";
import { PostDTO } from "../../post/dtos/PostDTO";

export class CommentDTO {
  @MockRelationID(() => PostDTO) postId: number;
  @MockID() id: number;
  @MockName() name: string;
  @MockEmail() email: string;
  @MockSentence() body: string;
}
