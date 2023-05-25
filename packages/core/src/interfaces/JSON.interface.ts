export type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONObject
  | JSONArray
  | undefined; // Undefined is technically not a JSON value, but is allowed for convenience

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = JSONValue[];
