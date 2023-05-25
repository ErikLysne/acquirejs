import { AcquireMockGenerator } from "@/interfaces/AcquireMockGenerator.interface";
import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";

export class AcquireMockDataStorage {
  public mockDecoratorMap = new Map<
    ClassConstructor,
    Map<PropertyKey, AcquireMockGenerator>
  >();
  public mockIDDecoratorMap = new Map<ClassConstructor, PropertyKey>();
  public mockRelationIDDecoratorMap = new Map<
    ClassConstructor,
    Map<PropertyKey, ClassConstructor>
  >();
  public mockRelationPropertyDecoratorMap = new Map<
    ClassConstructor,
    Map<PropertyKey, [cls: ClassConstructor, propertyKey: PropertyKey]>
  >();
  public IDDefaultHeadMap = new Map<ClassConstructor, number>();

  public clearIDHead(): void {
    this.IDDefaultHeadMap.clear();
  }

  public clearAll(): void {
    this.mockDecoratorMap.clear();
    this.mockIDDecoratorMap.clear();
    this.mockRelationIDDecoratorMap.clear();
    this.mockRelationPropertyDecoratorMap.clear();
    this.IDDefaultHeadMap.clear();
  }
}

const acquireMockDataStorage = new AcquireMockDataStorage();
export default acquireMockDataStorage;
