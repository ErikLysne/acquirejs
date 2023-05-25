import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import { AcquireMockGenerator } from "@/interfaces/AcquireMockGenerator.interface";
import Mock from "./Mock.decorator";

export default function MockID(
  generator?: AcquireMockGenerator
): PropertyDecorator {
  return function (target: any, propertyKey) {
    const existingMockIdKey = acquireMockDataStorage.mockIDDecoratorMap.get(
      target.constructor
    );
    if (existingMockIdKey) {
      console.error(
        `Duplicate 'MockID' decorators are not allowed. 'MockID' has already been set for '${String(
          existingMockIdKey
        )}'.`
      );
      return;
    }

    const generateDefaultIdFromCurrentHead: AcquireMockGenerator = () => {
      const currentHead =
        acquireMockDataStorage.IDDefaultHeadMap.get(target.constructor) ?? 0;
      const newHead = currentHead + 1;
      acquireMockDataStorage.IDDefaultHeadMap.set(target.constructor, newHead);
      return newHead;
    };

    acquireMockDataStorage.mockIDDecoratorMap.set(
      target.constructor,
      propertyKey
    );
    Mock(generator ?? generateDefaultIdFromCurrentHead)(target, propertyKey);
  };
}
