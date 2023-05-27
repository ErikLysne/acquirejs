import { acquireMockDataStorage } from "@acquirejs/core";
import { seedChanceInstance } from "@acquirejs/mocks";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import acquire, { mockCache } from "../api/acquire";
import populateMockCache from "../api/populateMockCache";

const RANDOM_SEED = 123;

export const AcquireMockContext = React.createContext<{
  mockingEnabled: boolean;
  setMockingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  mockingEnabled: false,
  setMockingEnabled: () => {}
});

export default function AcquireMockProvider({
  children
}: React.PropsWithChildren) {
  const [mockingEnabled, setMockingEnabled] = React.useState<boolean>(false);
  const [hookExecuteCount, setHookExecuteCount] = React.useState<number>(0);
  const queryClient = useQueryClient();

  React.useLayoutEffect(() => {
    (async () => {
      await seedChanceInstance(RANDOM_SEED); // Reset the random generator for @acquirejs/mocks
      mockCache.seedRandomGenerator(RANDOM_SEED); // Reset the random generator for generating IDs in the mock cache
      mockCache.clear(); // Clear the cache
      acquireMockDataStorage.clearIDHead(); // Clear the default IDs generated in the mock cache
      await populateMockCache(); // Populate the mock cache with initial data
      acquire.setMockingEnabled(mockingEnabled); // Set mocking enabled
      queryClient.invalidateQueries(); // Invalidate queries in React-Query

      setHookExecuteCount((value) => value + 1);
    })();
  }, [mockingEnabled]);

  return (
    <AcquireMockContext.Provider value={{ mockingEnabled, setMockingEnabled }}>
      {hookExecuteCount > 0 && children}
    </AcquireMockContext.Provider>
  );
}
