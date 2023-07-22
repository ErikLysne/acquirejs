import acquire from "../acquire";
import { UserDTO } from "./dtos/UserDTO";
import { UserModel } from "./models/UserModel";

export const getUsers = acquire
  .createRequestHandler()
  .withResponseMapping([UserModel], [UserDTO])
  .get({
    path: "/users"
  });

export const getUser = acquire
  .createRequestHandler()
  .withResponseMapping(UserModel, UserDTO)
  .get<{ userId: number }>({
    path: ({ userId }) => `/users/${userId}`
  });
