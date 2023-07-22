import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";

export default function isClassOrClassArray(
  input: unknown
): input is ClassOrClassArray {
  return (
    typeof input === "function" ||
    (Array.isArray(input) && typeof input[0] === "function")
  );
}
