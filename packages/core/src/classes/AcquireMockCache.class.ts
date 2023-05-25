import generateMock from "@/functions/generateMock.function";
import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import MersenneTwister from "mersenne-twister";
import AcquireDatabaseSimulator from "./AcquireDatabaseSimulator.class";

export default class AcquireMockCache {
  private cache = new Map<ClassConstructor, any[]>();
  private generator = new MersenneTwister();

  public get randomGenerator(): MersenneTwister {
    return this.generator;
  }

  public seedRandomGenerator(seed: number): void {
    this.generator = new MersenneTwister(seed);
  }

  public async fill<T>(cls: ClassConstructor<T>, count: number): Promise<T[]> {
    const values = this.cache.get(cls) ?? [];
    const newValues = await generateMock(cls, count, this);
    values.push(...newValues);
    this.cache.set(cls, values);
    return newValues;
  }

  public async add<T>(cls: ClassConstructor<T>, value?: T): Promise<T> {
    const values = this.cache.get(cls) ?? [];
    const newValue = value ?? (await generateMock(cls, undefined, this));
    values.push(newValue);
    this.cache.set(cls, values);
    return newValue;
  }

  public get<T>(cls: ClassConstructor<T>): T[] {
    return this.cache.get(cls) ?? [];
  }

  public remove<T>(cls: ClassConstructor<T>, value: T): void {
    const values = this.cache.get(cls);
    if (values) {
      const index = values.indexOf(value);
      if (index > -1) {
        values.splice(index, 1);
      }
    }
  }

  public clear(cls?: ClassConstructor): void {
    if (cls) {
      this.cache.delete(cls);
      return;
    }
    this.cache.clear();
  }

  public size(cls?: ClassConstructor): number {
    if (cls) {
      return this.get(cls)?.length ?? 0;
    }
    return this.cache.size;
  }

  public has<T>(cls: ClassConstructor<T>): boolean {
    return this.cache.has(cls);
  }

  public createDatabaseSimulator<T>(
    cls: ClassConstructor<T>
  ): AcquireDatabaseSimulator<T> {
    return new AcquireDatabaseSimulator<T>(cls, this);
  }
}
