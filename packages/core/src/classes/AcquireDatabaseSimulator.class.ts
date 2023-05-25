import { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import { plainToInstance } from "class-transformer";
import AcquireMockCache from "./AcquireMockCache.class";
import acquireMockDataStorage from "./AcquireMockDataStorage.class";

export default class AcquireDatabaseSimulator<T> {
  private cls: ClassConstructor<T>;
  private cache: AcquireMockCache;
  private data: T[];

  constructor(cls: ClassConstructor<T>, cache: AcquireMockCache, data?: T[]) {
    this.cls = cls;
    this.cache = cache;
    this.data = data ?? cache.get(cls);
  }

  public get(): T[] {
    return this.data;
  }

  public reset(): AcquireDatabaseSimulator<T> {
    return new AcquireDatabaseSimulator(this.cls, this.cache);
  }

  public sort(
    by?: keyof T,
    direction: "asc" | "desc" = "asc"
  ): AcquireDatabaseSimulator<T> {
    let sortedData = this.data;
    if (by) {
      sortedData = this.data.sort((a, b) => {
        if (a[by] < b[by]) {
          return direction === "asc" ? -1 : 1;
        } else if (a[by] > b[by]) {
          return direction === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });
    }

    return new AcquireDatabaseSimulator(this.cls, this.cache, sortedData);
  }

  public filter(predicate?: (item: T) => boolean): AcquireDatabaseSimulator<T> {
    let filteredData = this.data;
    if (predicate) {
      filteredData = this.data.filter(predicate);
    }

    return new AcquireDatabaseSimulator(this.cls, this.cache, filteredData);
  }

  public paginate(
    page?: number,
    pageSize?: number,
    baseIndex = 0
  ): AcquireDatabaseSimulator<T> {
    let paginatedData = this.data;
    if (page != null && pageSize != null) {
      const adjustedPage = page - baseIndex;
      paginatedData = this.data.slice(
        adjustedPage * pageSize,
        (adjustedPage + 1) * pageSize
      );
    }

    return new AcquireDatabaseSimulator(this.cls, this.cache, paginatedData);
  }

  public search(
    keyword?: string,
    fields?: (keyof T)[],
    caseSensitive = false
  ): AcquireDatabaseSimulator<T> {
    let searchedData = this.data;
    if (keyword && fields) {
      searchedData = this.data.filter((item) =>
        fields.some((field) => {
          if (caseSensitive) {
            return String(item[field]).includes(keyword);
          } else {
            return String(item[field])
              .toLowerCase()
              .includes(keyword.toLowerCase());
          }
        })
      );
    }

    return new AcquireDatabaseSimulator(this.cls, this.cache, searchedData);
  }

  public find(predicate: (item: T) => boolean): T | undefined {
    const values = this.cache.get(this.cls);
    return values.find(predicate);
  }

  public generateNextID(): any {
    const idKey = acquireMockDataStorage.mockIDDecoratorMap.get(this.cls);

    if (idKey) {
      const idValue = acquireMockDataStorage.mockDecoratorMap
        .get(this.cls)
        ?.get(idKey);
      return typeof idValue === "function" ? idValue() : idValue;
    }
  }

  public create(item: T): T {
    if (item instanceof this.cls) {
      this.cache.add(this.cls, item);
      return item;
    }

    const itemInstance = plainToInstance(this.cls, item);
    this.cache.add(this.cls, itemInstance);
    return itemInstance;
  }

  public update(
    id: any,
    update: Partial<T>,
    idField: keyof T | "id" = "id"
  ): T | undefined {
    const values = this.cache.get(this.cls);
    const index = values.findIndex(
      (item) => (item as T & { id: any })[idField] === id
    );
    if (index !== -1) {
      const newItem = { ...values[index], ...update };
      values[index] = newItem;
      this.cache.clear(this.cls);
      values.forEach((value) => {
        this.cache.add(this.cls, value);
      });
      return newItem;
    }
    return undefined;
  }

  public delete(id: any, idField: keyof T | "id" = "id"): boolean {
    const values = this.cache.get(this.cls);
    const index = values.findIndex(
      (item) => (item as T & { id: any })[idField] === id
    );
    if (index !== -1) {
      this.cache.remove(this.cls, values[index]);
      return true;
    }
    return false;
  }

  public count(): number {
    return this.cache.size(this.cls);
  }
}
