export default function isPlainObject(obj: object): boolean {
  if (typeof obj !== "object" || obj === null || obj.constructor !== Object) {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  if (proto === null) {
    return true;
  }

  return proto === Object.prototype;
}
