import AcquireLogger from "@/classes/AcquireLogger.class";

describe("class: AcquireLogger", () => {
  let logger: AcquireLogger;
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    logger = new AcquireLogger();
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  describe("function: log", () => {
    it("should log to console by default", () => {
      logger.log("Test message");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Test message")
      );
    });
  });
});
