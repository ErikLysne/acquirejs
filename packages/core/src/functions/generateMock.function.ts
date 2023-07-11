import AcquireMockCache from "@/classes/AcquireMockCache.class";
import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import AcquireError from "@/errors/AcquireError.error";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import { AcquireMockGenerator } from "@/interfaces/AcquireMockGenerator.interface";
import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import { plainToInstance } from "class-transformer";

function createAndStoreRelationID(
  cls: ClassConstructor,
  propertyKey: PropertyKey,
  MockRelationClass: ClassConstructor,
  mockCache: AcquireMockCache,
  relationIDMap: Map<ClassConstructor, any>
): any {
  const mockDataIDKey =
    acquireMockDataStorage.mockIDDecoratorMap.get(MockRelationClass);
  if (!mockDataIDKey) {
    throw new AcquireError(
      `A 'MockRelationID' decorator for '${String(
        propertyKey
      )}' was set on class '${cls.name}' to establish a relation to class '${
        MockRelationClass.name
      }', but class '${
        MockRelationClass.name
      }' is missing required 'MockID' decorator.`
    );
  }
  const mockCacheData = mockCache.get(MockRelationClass);

  if (!mockCacheData || mockCacheData.length === 0) {
    throw new AcquireError(
      `Attempted to instantiate mock data for class '${cls.name}' with relation to class '${MockRelationClass.name}', but no instances of class '${MockRelationClass.name}' exists in the mock cache. Consider pre-populating the cache with instances of class '${MockRelationClass.name}' by calling 'mockCache.fill(${MockRelationClass.name}, 10)'.`
    );
  }
  const randomIndex = Math.floor(
    mockCache.randomGenerator.random() * mockCacheData.length
  );

  const relationID = mockCacheData[randomIndex][mockDataIDKey];
  relationIDMap.set(MockRelationClass, relationID);
  return relationID;
}

export async function createMockObject<
  TClassConstructor extends ClassConstructor
>(
  cls: TClassConstructor,
  mockCache?: AcquireMockCache,
  context?: AcquireContext
): Promise<InstanceType<TClassConstructor>> {
  const mockDecorators = acquireMockDataStorage.mockDecoratorMap.get(cls);

  // No mock decorators were found on the class
  if (!mockDecorators) {
    return plainToInstance(cls, {});
  }

  const mockRelationIDDecorators =
    acquireMockDataStorage.mockRelationIDDecoratorMap.get(cls);
  const mockRelationPropertyDecorators =
    acquireMockDataStorage.mockRelationPropertyDecoratorMap.get(cls);

  const plainMockObject: Record<PropertyKey, AcquireMockGenerator> = {};
  const relationIDMap = new Map<ClassConstructor, any>();

  // TODO: Refactor with Promise.all
  for await (const [propertyKey, generator] of mockDecorators.entries()) {
    let value: any;
    const MockRelationClass = mockRelationIDDecorators?.get(propertyKey);
    const mockRelationProperty =
      mockRelationPropertyDecorators?.get(propertyKey);

    if (!mockCache || !(MockRelationClass || mockRelationProperty)) {
      // No mockCache or no MockRelationID or MockRelationProperty decorator -> create the value directly from the generator
      value =
        typeof generator === "function" ? await generator(context) : generator;
    } else {
      if (MockRelationClass) {
        let relationID = relationIDMap.get(MockRelationClass);
        if (!relationID) {
          // A MockRelationID decorator exists, but no relation ID has been appointed yet
          relationID = createAndStoreRelationID(
            cls,
            propertyKey,
            MockRelationClass,
            mockCache,
            relationIDMap
          );
        }
        value = relationID;
      } else if (mockRelationProperty) {
        const MockRelationClass = mockRelationProperty[0];
        const mockDataIDKey =
          acquireMockDataStorage.mockIDDecoratorMap.get(MockRelationClass);

        if (!mockDataIDKey) {
          throw new AcquireError(
            `A 'MockRelationProperty' decorator for '${String(
              propertyKey
            )}' was set on class '${
              cls.name
            }' to establish a relation to class '${
              MockRelationClass.name
            }', but class '${
              MockRelationClass.name
            }' is missing required 'MockID' decorator.`
          );
        }

        const mockCacheData: any[] = mockCache.get(MockRelationClass);

        let relationID = relationIDMap.get(MockRelationClass);
        if (!relationID) {
          // A MockRelationID decorator exists, but no relation ID has been appointed yet
          relationID = createAndStoreRelationID(
            cls,
            propertyKey,
            MockRelationClass,
            mockCache,
            relationIDMap
          );
        }
        // Locate the referenced object in the mock cache
        const referencedCacheObject: any = mockCacheData.find(
          (data) => data[mockDataIDKey] === relationID
        );
        value = referencedCacheObject[mockRelationProperty[1]];
      }
    }
    plainMockObject[propertyKey] = value;
  }

  return plainToInstance(cls, plainMockObject);
}

export default async function generateMock<
  TClassConstructor extends ClassConstructor
>(
  classConstructor: TClassConstructor,
  count?: undefined,
  mockCache?: AcquireMockCache,
  context?: AcquireContext
): Promise<InstanceType<TClassConstructor>>;
export default async function generateMock<
  TClassConstructor extends ClassConstructor
>(
  classConstructor: TClassConstructor,
  count: number,
  mockCache?: AcquireMockCache,
  context?: AcquireContext
): Promise<InstanceType<TClassConstructor>[]>;
export default async function generateMock<
  TClassConstructor extends ClassConstructor
>(
  classConstructor: TClassConstructor,
  count?: number,
  mockCache?: AcquireMockCache,
  context?: AcquireContext
): Promise<InstanceType<TClassConstructor> | InstanceType<ClassConstructor>[]> {
  if (typeof count === "number") {
    const mockCalls = [];

    for (let i = 0; i < count; i++) {
      mockCalls.push(createMockObject(classConstructor, mockCache, context));
    }
    return Promise.all(mockCalls);
  }

  return createMockObject(classConstructor, mockCache, context);
}
