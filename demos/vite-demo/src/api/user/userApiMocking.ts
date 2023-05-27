import { UserDTO } from "./dtos/UserDTO";
import { getUser } from "./userApi";

getUser.setMockInterceptor(
  async ({ mockResponse, mockCache, callArgs, delay }) => {
    const { userId } = callArgs ?? {};

    const dbSimulator = mockCache?.createDatabaseSimulator(UserDTO);
    const user = dbSimulator?.find((user) => user.id === userId);

    mockResponse.data = user;

    await delay(300, 500);

    return Promise.resolve(mockResponse);
  }
);
