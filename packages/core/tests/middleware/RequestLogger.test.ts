import { Acquire } from "@/classes/Acquire.class";
import AcquireLogger from "@/classes/AcquireLogger.class";
import RequestLogger from "@/middleware/RequestLogger.middleware";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";

describe("middleware: RequestLogger", () => {
  const { blue, green, red, cyan, yellow, brightBlack, brightBlue, reset } =
    AcquireLogger.color;
  const axiosInstance = axios.create();
  const mockAxios = new MockAdapter(axiosInstance);

  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const acquire = new Acquire(axiosInstance);
  acquire.use(
    new RequestLogger({
      timezone: "UTC"
    })
  );

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
    consoleSpy.mockRestore();
    mockAxios.reset();
  });

  it("should log executed requests", async () => {
    mockAxios.onGet("http://api.example.com/users").reply(200, {});

    const getUsers = acquire.createRequestHandler().get({
      url: "http://api.example.com/users"
    });

    await getUsers();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${blue}[Acquire]${reset} - ${brightBlack}03/07/2023 11:22:33${reset} - ${green}            [Executed]${reset} ${cyan}[GET: /users]:${reset} ${green}200${reset}`
    );
  });

  it("should log executed requests with errors", async () => {
    mockAxios.onGet("http://api.example.com/users").reply(404, {});

    const getUsers = acquire.createRequestHandler().get({
      url: "http://api.example.com/users"
    });

    await expect(getUsers()).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${red}[Acquire]${reset} - ${brightBlack}03/07/2023 11:22:33${reset} - ${green}            [Executed]${reset} ${cyan}[GET: /users]:${reset} ${red}404 - Request failed with status code 404${reset}`
    );
  });

  it("should log mocked requests", async () => {
    const getUsers = acquire.createRequestHandler().get({
      url: "http:/api.example.com/users"
    });

    await getUsers.mock();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${blue}[Acquire]${reset} - ${brightBlack}03/07/2023 11:22:33${reset} - ${yellow}[Mocked ->${brightBlue}on demand${yellow}]${reset} ${cyan}[GET: /users]:${reset} ${green}200 - OK${reset}`
    );
  });

  it("should log mocked requests with errors", async () => {
    const getUsers = acquire.createRequestHandler().get({
      url: "http://api.example.com/users"
    });

    getUsers.use((context) => {
      const error = new AxiosError("Not found");
      error.response = {
        ...context.response,
        statusText: "Not found",
        status: 404
      };

      throw error;
    });

    await expect(getUsers.mock()).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${red}[Acquire]${reset} - ${brightBlack}03/07/2023 11:22:33${reset} - ${yellow}[Mocked ->${green}intercepted${yellow}]${reset} ${cyan}[GET: /users]:${reset} ${red}404 - Not found${reset}`
    );
  });
});
