import { createMockObject } from "@/functions/generateMock.function";
import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import Mock from "./Mock.decorator";

export default function MockDTO(
  typeFn: () => ClassConstructor
): PropertyDecorator {
  return Mock(() => createMockObject(typeFn()));
}
