import { initAcquireMocks } from "@acquire/mocks";

export default async function mockInit() {
  initAcquireMocks();
  return Promise.all([
    import("./comment/commentApiMocking"),
    import("./post/postApiMocking"),
    import("./user/userApiMocking")
  ]);
}
