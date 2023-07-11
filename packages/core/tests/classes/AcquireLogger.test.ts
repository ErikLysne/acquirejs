import AcquireLogger from "@/classes/AcquireLogger.class";

describe("class: AcquireLogger", () => {
  const { blue, red, brightBlack, reset } = AcquireLogger.color;
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  const logger = new AcquireLogger({ timezone: "UTC" });

  const OriginalDate = global.Date;

  beforeAll(() => {
    const mockDate = new OriginalDate("2023-07-03T11:22:33Z");

    function MockDate(): Date {
      return new OriginalDate(mockDate.getTime());
    }

    MockDate.UTC = OriginalDate.UTC;
    MockDate.parse = OriginalDate.parse;
    MockDate.now = (): number => mockDate.getTime();
    MockDate.prototype = OriginalDate.prototype;
    MockDate.prototype.constructor = MockDate;

    global.Date = MockDate as any;
  });

  afterAll(() => {
    global.Date = OriginalDate;
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
        `${reset}${blue}[Acquire]${reset} - ${brightBlack}03/07/2023 11:22:33${reset} - Hello world`
      );
    });

    it("should have the correct formatting for logging error", () => {
      logger.error("Hello world");

      expect(consoleSpy).toHaveBeenCalledWith(
        `${reset}${red}[Acquire]${reset} - ${brightBlack}03/07/2023 11:22:33${reset} - Hello world`
      );
    });
  });
});
