import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import MockRelationProperty from "@/decorators/mocks/MockRelationProperty.decorator";

describe("decorator: MockRelationProperty", () => {
  beforeEach(() => {
    acquireMockDataStorage.clearAll();
  });

  it("should add the relation to the mockRelationPropertyDecoratorMap", () => {
    class UserDTO {
      name: string;
    }
    class CommentDTO {
      id: number;
      @MockRelationProperty(() => UserDTO, "name") userName: string;
    }

    expect(
      acquireMockDataStorage.mockRelationPropertyDecoratorMap
        .get(CommentDTO)
        ?.get("userName")
    ).toEqual([UserDTO, "name"]);
  });
});
