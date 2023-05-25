const RequestMethod = {
  GET: "GET",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  PURGE: "PURGE",
  LINK: "LINK",
  UNLINK: "UNLINK"
} as const;

export type RequestMethodType = keyof typeof RequestMethod;
export default RequestMethod;
