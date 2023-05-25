import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import MockRelationID from "@/decorators/mocks/MockRelationID.decorator";

describe("decorator: MockRelationID", () => {
  beforeEach(() => {
    acquireMockDataStorage.clearAll();
  });

  it("should add the relation to the mockRelationIDDecorators", () => {
    class PostDTO {}
    class CommentDTO {
      id: number;
      @MockRelationID(() => PostDTO) postId: number;
    }

    expect(
      acquireMockDataStorage.mockRelationIDDecoratorMap
        .get(CommentDTO)
        ?.get("postId")
    ).toEqual(PostDTO);
  });
});
