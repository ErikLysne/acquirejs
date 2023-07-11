import {
  Acquire,
  AcquireMockCache,
  AcquireRequestLogger
} from "@acquirejs/core";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

export const mockCache = new AcquireMockCache();

const acquire = new Acquire(axiosInstance)
  .useMockCache(mockCache)
  .use(new AcquireRequestLogger());

export default acquire;
