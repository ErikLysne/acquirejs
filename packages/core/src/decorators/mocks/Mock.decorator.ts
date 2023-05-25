import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import { AcquireMockGenerator } from "@/interfaces/AcquireMockGenerator.interface";

export default function Mock(
  generator: AcquireMockGenerator
): PropertyDecorator {
  return function (target: any, propertyKey): void {
    let mockDataValuesForClass = acquireMockDataStorage.mockDecoratorMap.get(
      target.constructor
    );

    if (!mockDataValuesForClass) {
      mockDataValuesForClass = new Map<PropertyKey, AcquireMockGenerator>();
      acquireMockDataStorage.mockDecoratorMap.set(
        target.constructor,
        mockDataValuesForClass
      );
    }

    mockDataValuesForClass.set(propertyKey, generator);
  };
}
