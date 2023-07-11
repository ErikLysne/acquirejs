import { Acquire, AcquireLogger } from "@/index";
import AcquireRequestLogger from "@/middleware/AcquireRequestLogger";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";

describe("middleware: AcquireRequestLogger", () => {
  const {
    blue,
    green,
    red,
    cyan,
    yellow,
    brightBlack,
    brightBlue,
    brightGreen,
    reset
  } = AcquireLogger.color;
  const axiosInstance = axios.create();
  const mockAxios = new MockAdapter(axiosInstance);

  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const acquire = new Acquire(axiosInstance);
  acquire.use(new AcquireRequestLogger());

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
    consoleSpy.mockRestore();
    mockAxios.reset();
  });

  it("should log executed requests", async () => {
    mockAxios.onGet("http://example.com/users").reply(200, {});

    const getUsers = acquire({
      request: {
        url: "http://example.com/users"
      }
    });

    await getUsers();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${blue}[Acquire]${reset} - ${brightBlack}03/07/2023 13:22:33${reset} - ${green}            [Executed]${reset} ${cyan}[GET: /users]:${reset} ${green}200${reset}`
    );
  });

  it("should log executed requests with errors", async () => {
    mockAxios.onGet("http://example.com/users").reply(404, {});

    const getUsers = acquire({
      request: {
        url: "http://example.com/users"
      }
    });

    await expect(getUsers()).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${red}[Acquire]${reset} - ${brightBlack}03/07/2023 13:22:33${reset} - ${green}            [Executed]${reset} ${cyan}[GET: /users]:${reset} ${red}404 - Request failed with status code 404${reset}`
    );
  });

  it("should log mocked requests", async () => {
    const getUsers = acquire({
      request: {
        url: "http://example.com/users"
      }
    });

    await getUsers.mock();

    expect(consoleSpy).toHaveBeenCalledWith(
      `${reset}${blue}[Acquire]${reset} - ${brightBlack}03/07/2023 13:22:33${reset} - ${yellow}[Mocked ->${brightBlue}on demand${yellow}]${reset} ${cyan}[GET: /users]:${reset} ${green}200 - OK${reset}`
    );
  });

  it("should log mocked requests with errors", async () => {
    const getUsers = acquire({
      request: {
        url: "http://example.com/users"
      }
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
      `${reset}${red}[Acquire]${reset} - ${brightBlack}03/07/2023 13:22:33${reset} - ${yellow}[Mocked ->${green}intercepted${yellow}]${reset} ${cyan}[GET: /users]:${reset} ${red}404 - Not found${reset}`
    );
  });
});
