import { MockID, MockRelationID } from "@acquirejs/core";
import { MockParagraph, MockSentence } from "@acquirejs/mocks";
import { UserDTO } from "../../user/dtos/UserDTO";

export class PostDTO {
  @MockRelationID(() => UserDTO) userId: number;
  @MockID() id: number;
  @MockSentence() title: string;
  @MockParagraph({ sentences: 10 }) body: string;
}
