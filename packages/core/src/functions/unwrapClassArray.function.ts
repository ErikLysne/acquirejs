import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import { ClassOrClassArray } from "@/interfaces/ClassOrClassArray.interface";

export default function unwrapClassOrClassArray<
  TClassConstructor extends ClassOrClassArray
>(
  cls: TClassConstructor
): {
  ClassUnwrapped: TClassConstructor extends [cls: ClassConstructor]
    ? TClassConstructor[0]
    : TClassConstructor;
  isClassArray: boolean;
} {
  const isClassArray = Array.isArray(cls);
  return {
    ClassUnwrapped: (isClassArray ? cls[0] : cls) as any,
    isClassArray
  };
}
