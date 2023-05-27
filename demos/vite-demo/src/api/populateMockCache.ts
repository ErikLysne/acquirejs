import { generateMock } from "@acquirejs/core";
import { mockCache } from "./acquire";
import { CommentDTO } from "./comment/dtos/CommentDTO";
import { PostDTO } from "./post/dtos/PostDTO";
import { UserDTO } from "./user/dtos/UserDTO";

export let demoUser = new UserDTO();

export default async function populateMockCache() {
  await mockCache.fill(UserDTO, 20);
  await mockCache.fill(PostDTO, 50);
  await mockCache.fill(CommentDTO, 100);

  const demoUserData = await generateMock(UserDTO);
  demoUser = { ...demoUserData };
  demoUser.name = "Demo user";
  demoUser.email = "user@demo.com";
  await mockCache.add(UserDTO, demoUser);
}
