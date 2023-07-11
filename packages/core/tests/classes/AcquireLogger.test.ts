import AcquireLogger from "@/classes/AcquireLogger.class";

describe("class: AcquireLogger", () => {
  const { blue, red, brightBlack, reset } = AcquireLogger.color;
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  const logger = new AcquireLogger();

  const OriginalDate = global.Date;

  beforeAll(() => {
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => new OriginalDate("2023-07-03T11:22:33Z"));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  describe("function: log", () => {
    it("should log to console by default", () => {
      logger.log("Hello world");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Hello world")
      );
    });

    it("should have the correct formatting for logging info", () => {
      logger.info("Hello world");

      expect(consoleSpy).toHaveBeenCalledWith(
        `${reset}${blue}[Acquire]${reset} - ${brightBlack}03/07/2023 13:22:33${reset} - Hello world`
      );
    });

    it("should have the correct formatting for logging error", () => {
      logger.error("Hello world");

      expect(consoleSpy).toHaveBeenCalledWith(
        `${reset}${red}[Acquire]${reset} - ${brightBlack}03/07/2023 13:22:33${reset} - Hello world`
      );
    });
  });
});
