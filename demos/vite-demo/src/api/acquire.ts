import { Acquire, AcquireLogger, AcquireMockCache } from "@acquire/core";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

export const mockCache = new AcquireMockCache();

const acquire = new Acquire(axiosInstance)
  .useMockCache(mockCache)
  .useLogger(new AcquireLogger());

export default acquire;
