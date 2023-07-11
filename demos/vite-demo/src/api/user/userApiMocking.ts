import { UserDTO } from "./dtos/UserDTO";
import { getUser } from "./userApi";

getUser.useOnMocking(({ response, mockCache, callArgs }) => {
  const { userId } = callArgs ?? {};

  const dbSimulator = mockCache?.createDatabaseSimulator(UserDTO);
  const user = dbSimulator?.find((user) => user.id === userId);

  response.data = user;
});
