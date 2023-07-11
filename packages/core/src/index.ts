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
/* -------------------------------- Constants ------------------------------- */
export {
  default as RequestMethod,
  type RequestMethodType
} from "./constants/RequestMethod.const";
/*/
/* -------------------------------------------------------------------------- */
/*/
/* ------------------------------- Decorators ------------------------------- */
export { default as Mock } from "./decorators/mocks/Mock.decorator";
export { default as MockDTO } from "./decorators/mocks/MockDTO.decorator";
export { default as MockID } from "./decorators/mocks/MockID.decorator";
export { default as MockRelationID } from "./decorators/mocks/MockRelationID.decorator";
export { default as MockRelationProperty } from "./decorators/mocks/MockRelationProperty.decorator";
export {
  default as ToBoolean,
  type ToBooleanOptions
} from "./decorators/transformers/ToBoolean.decorator";
export {
  default as ToDate,
  type ToDateOptions
} from "./decorators/transformers/ToDate.decorator";
export {
  default as ToJSON,
  type ToJSONOptions
} from "./decorators/transformers/ToJSON.decorator";
export {
  default as ToLowerCaseString,
  type ToLowerCaseStringOptions
} from "./decorators/transformers/ToLowerCaseString.decorator";
export {
  default as ToNumber,
  type ToNumberOptions
} from "./decorators/transformers/ToNumber.decorator";
export {
  default as ToString,
  type ToStringOptions
} from "./decorators/transformers/ToString.decorator";
export {
  default as ToTrimmedString,
  type ToTrimmedStringOptions
} from "./decorators/transformers/ToTrimmedString.decorator";
export {
  default as ToUpperCaseString,
  type ToUpperCaseStringOptions
} from "./decorators/transformers/ToUpperCaseString.decorator";
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
export type { AcquireCallArgs } from "./interfaces/AcquireCallArgs.interface";
export type { AcquireContext } from "./interfaces/AcquireContext.interface";
export type {
  AcquireMiddleware,
  AcquireMiddlewareClass,
  AcquireMiddlewareFn,
  AcquireMiddlewareWithOrder
} from "./interfaces/AcquireMiddleware.interface";
export type { AcquireMockGenerator } from "./interfaces/AcquireMockGenerator.interface";
export type { AcquireRequestOptions } from "./interfaces/AcquireRequestOptions.interface";
export type { AcquireTransformerOptions } from "./interfaces/AcquireTransformerOptions.interface";
export type { ClassConstructor } from "./interfaces/ClassConstructor.interface";
export type { ClassOrClassArray } from "./interfaces/ClassOrClassArray.interface";
export type { InstanceOrInstanceArray } from "./interfaces/InstanceOrInstanceArray.interface";
export type {
  JSONArray,
  JSONObject,
  JSONValue
} from "./interfaces/JSON.interface";
export type { LogLevel, Logger, LoggerFn } from "./interfaces/Logger.interface";
export type { OmitFirstArg } from "./interfaces/OmitFirstArg.interface";
export type { ValueOrCallback } from "./interfaces/ValueOrCallback.interface";
/* -------------------------------------------------------------------------- */
/*/
/* ------------------------------- Middleware ------------------------------- */
export { default as AcquireRequestLogger } from "./middleware/AcquireRequestLogger";
/* -------------------------------------------------------------------------- */
