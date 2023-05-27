import { MockID, MockRelationID } from "@acquire/core";
import { MockParagraph, MockSentence } from "@acquire/mocks";
import { UserDTO } from "../../user/dtos/UserDTO";

export class PostDTO {
  @MockRelationID(() => UserDTO) userId: number;
  @MockID() id: number;
  @MockSentence() title: string;
  @MockParagraph({ sentences: 10 }) body: string;
}
