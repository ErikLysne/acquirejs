import acquire from "../acquire";
import { UserDTO } from "./dtos/UserDTO";
import { UserModel } from "./models/UserModel";

export const getUsers = acquire({
  request: {
    path: "/users"
  },
  responseMapping: {
    DTO: [UserDTO],
    Model: [UserModel]
  }
});

export const getUser = acquire.withCallArgs<{ userId: number }>()({
  request: {
    path: (args) => `/users/${args?.userId}`
  },
  responseMapping: {
    DTO: UserDTO,
    Model: UserModel
  }
});
