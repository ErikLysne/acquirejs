import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import Mock from "./Mock.decorator";

export default function MockRelationID(
  typeFn: () => ClassConstructor
): PropertyDecorator {
  return function (target: any, propertyKey) {
    let mockDataRelationForClass =
      acquireMockDataStorage.mockRelationIDDecoratorMap.get(target.constructor);

    if (!mockDataRelationForClass) {
      mockDataRelationForClass = new Map<PropertyKey, ClassConstructor>();
      acquireMockDataStorage.mockRelationIDDecoratorMap.set(
        target.constructor,
        mockDataRelationForClass
      );
    }

    mockDataRelationForClass.set(propertyKey, typeFn());
    Mock(null)(target, propertyKey);
  };
}
