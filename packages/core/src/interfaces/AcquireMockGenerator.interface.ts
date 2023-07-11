import { AcquireContext } from "./AcquireContext.interface";
import { JSONValue } from "./JSON.interface";

export type AcquireMockGenerator =
  | JSONValue
  | ((context?: AcquireContext, ...args: any) => JSONValue)
  | (() => Promise<JSONValue>);
