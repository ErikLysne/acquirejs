import { ClassConstructor } from "@acquirejs/core";

let getChanceInstance = async (): Promise<Chance.Chance | null> => {
  return Promise.resolve(null);
};

let seedChanceInstance = async (
  ..._seed: Chance.Seed[]
): Promise<Chance.Chance | null> => {
  return Promise.resolve(null);
};

let resetChanceInstance = async (): Promise<Chance.Chance | null> => {
  return Promise.resolve(null);
};

let ChanceClass: ClassConstructor<Chance.Chance>;
let instance: Chance.Chance;
let seed: Chance.Seed[];

function initAcquireMocks(): void {
  const importChanceModule = async (): Promise<
    ClassConstructor<Chance.Chance>
  > => {
    if (!ChanceClass) {
      const Chance = await import("chance");
      ChanceClass = Chance.default;
    }

    return ChanceClass;
  };

  getChanceInstance = async (): Promise<Chance.Chance | null> => {
    if (!instance) {
      await importChanceModule();
      instance = new ChanceClass();
    }
    return instance;
  };

  seedChanceInstance = async (
    ...seed: Chance.Seed[]
  ): Promise<Chance.Chance | null> => {
    if (!ChanceClass) {
      await importChanceModule();
    }
    seed = seed;
    instance = new ChanceClass(...seed);
    return instance;
  };

  resetChanceInstance = async (): Promise<Chance.Chance | null> => {
    if (!ChanceClass) {
      await importChanceModule();
    }
    instance = new ChanceClass(...(seed ?? []));
    return instance;
  };
}

export { initAcquireMocks };
export { getChanceInstance };
export { seedChanceInstance };
export { resetChanceInstance };
