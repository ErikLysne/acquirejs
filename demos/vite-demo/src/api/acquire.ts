import { Acquire, AcquireMockCache, RequestLogger } from "@acquirejs/core";
import axios from "axios";

export const mockCache = new AcquireMockCache();

const acquire = new Acquire(
  axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
  })
)
  .useMockCache(mockCache)
  .use(new RequestLogger());

export default acquire;
