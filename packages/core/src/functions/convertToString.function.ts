export default function convertToString(value: any): string | null {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value && typeof value === "object") {
    if (typeof value.toString === "function") {
      const str = value.toString();
      if (str && str !== "[object Object]") {
        return str;
      }
    } else {
      const proto = Object.getPrototypeOf(value);
      if (proto && typeof proto.toString === "function") {
        const str = proto.toString.call(value);
        if (str && str !== "[object Object]") {
          return str;
        }
      }
    }
  }

  // Can't convert to a meaningful string
  return null;
}
