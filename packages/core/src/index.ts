/* -------------------------------------------------------------------------- */
/*                               Package exports                              */
/* -------------------------------------------------------------------------- */
/* -------------------------------- External -------------------------------- */
import "reflect-metadata";
export * from "class-transformer";
/* -------------------------------------------------------------------------- */
/*/
/* --------------------------------- Classes -------------------------------- */
export { Acquire } from "./classes/Acquire.class";
export { default as AcquireLogger } from "./classes/AcquireLogger.class";
export { default as AcquireMockCache } from "./classes/AcquireMockCache.class";
export { default as acquireMockDataStorage } from "./classes/AcquireMockDataStorage.class";
/* -------------------------------------------------------------------------- */
/*/
/* ------------------------------- Decorators ------------------------------- */
export { default as Mock } from "./decorators/mocks/Mock.decorator";
export { default as MockDTO } from "./decorators/mocks/MockDTO.decorator";
export { default as MockID } from "./decorators/mocks/MockID.decorator";
export { default as MockRelationID } from "./decorators/mocks/MockRelationID.decorator";
export { default as MockRelationProperty } from "./decorators/mocks/MockRelationProperty.decorator";
export { default as ToNumber } from "./decorators/transformers/ToNumber.decorator";
/* -------------------------------------------------------------------------- */
/*/
/* --------------------------------- Errors --------------------------------- */
export { default as AcquireError } from "./errors/AcquireError.error";
/* -------------------------------------------------------------------------- */
/*/
/* -------------------------------- Functions ------------------------------- */
export {
  createMockObject,
  default as generateMock
} from "./functions/generateMock.function";
export { default as transform } from "./functions/transform.function";
/* -------------------------------------------------------------------------- */
/*/
/* ------------------------------- Interfaces ------------------------------- */
export type { AcquireArgs } from "./interfaces/AcquireArgs.interface";
export type { AcquireMockContext } from "./interfaces/AcquireMockContext.interface";
export type { AcquireMockGenerator } from "./interfaces/AcquireMockGenerator.interface";
export type { AcquireRequestOptions } from "./interfaces/AcquireRequestOptions.interface";
export type { AcquireResult } from "./interfaces/AcquireResult.interface";
export type { ClassConstructor } from "./interfaces/ClassConstructor.interface";
export type { InstanceOrInstanceArray } from "./interfaces/InstanceOrInstanceArray.interface";
export type {
  JSONArray,
  JSONObject,
  JSONValue
} from "./interfaces/JSON.interface";
export type { LogLevel, Logger, LoggerFn } from "./interfaces/Logger.interface";
export type { ValueOrCallback } from "./interfaces/ValueOrCallback.interface";
