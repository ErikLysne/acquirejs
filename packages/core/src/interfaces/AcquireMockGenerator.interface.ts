import { AcquireMockContext } from "./AcquireMockContext.interface";
import { JSONValue } from "./JSON.interface";

export type AcquireMockGenerator =
  | JSONValue
  | ((context?: AcquireMockContext, ...args: any) => JSONValue)
  | (() => Promise<JSONValue>);
