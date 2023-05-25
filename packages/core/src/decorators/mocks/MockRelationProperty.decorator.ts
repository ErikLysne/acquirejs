import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import Mock from "./Mock.decorator";

export default function MockRelationProperty<
  TClassConstructor extends ClassConstructor
>(
  typeFn: () => TClassConstructor,
  targetPropertyKey: keyof InstanceType<TClassConstructor>
): PropertyDecorator {
  return function (target: any, propertyKey) {
    let mockDataRelationFieldForClass =
      acquireMockDataStorage.mockRelationPropertyDecoratorMap.get(
        target.constructor
      );

    if (!mockDataRelationFieldForClass) {
      mockDataRelationFieldForClass = new Map<
        PropertyKey,
        [cls: ClassConstructor, propertyKey: PropertyKey]
      >();
      acquireMockDataStorage.mockRelationPropertyDecoratorMap.set(
        target.constructor,
        mockDataRelationFieldForClass
      );
    }

    mockDataRelationFieldForClass.set(propertyKey, [
      typeFn(),
      targetPropertyKey
    ]);
    Mock(null)(target, propertyKey);
  };
}
