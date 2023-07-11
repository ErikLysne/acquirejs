import AcquireLogger, { AcquireLogColor } from "@/classes/AcquireLogger.class";
import RequestMethod from "@/constants/RequestMethod.const";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import {
  AcquireMiddlewareClass,
  AcquireMiddlewareFn
} from "@/interfaces/AcquireMiddleware.interface";
import { LogLevel, LoggerFn } from "@/interfaces/Logger.interface";
import axios from "axios";

export interface AcquireRequestLoggerOptions {
  logFn?: LoggerFn;
  logLevels?: LogLevel[] | "all";
}

export default class AcquireRequestLogger implements AcquireMiddlewareClass {
  public order = 1000;

  private logger: AcquireLogger;

  constructor(options?: AcquireRequestLoggerOptions) {
    const { logFn, logLevels } = options ?? {};
    this.logger = new AcquireLogger(logFn, logLevels);
  }

  getStatusCodeColor(statusCode: number): AcquireLogColor {
    const statusClass = Math.floor(statusCode / 100);

    switch (statusClass) {
      case 1: // Informational
        return "blue";
      case 2: // Success
        return "green";
      case 3: // Redirection
        return "yellow";
      case 4: // Client error
        return "red";
      case 5: // Server error
        return "red";
      default: // Unknown status code
        return "white";
    }
  }

  logAcquireCall(logger: AcquireLogger, context: AcquireContext): void {
    const { response, type, method, error } = context;
    const isMocked = type === "mocking";
    const isOnDemand = response.data == null && error == null;

    const uri = axios.getUri(response.config);
    const urlObj = new URL(uri);

    const mockedOrExecutedLabel = AcquireLogger.colorize(
      `[${
        isMocked
          ? `Mocked ->${
              isOnDemand
                ? AcquireLogger.colorize("on demand", "brightBlue", "yellow")
                : AcquireLogger.colorize("intercepted", "green", "yellow")
            }`
          : "Executed"
      }]`.padStart(22, " "),
      isMocked ? "yellow" : "green"
    );

    const requestDetailsLabel = AcquireLogger.colorize(
      `[${RequestMethod[method ?? "GET"]}: ${urlObj.pathname}]:`,
      "cyan"
    );

    const statusLabel = AcquireLogger.colorize(
      `${response.status}${
        response.statusText || error?.message
          ? ` - ${error?.message ?? response.statusText}`
          : ""
      }`,
      this.getStatusCodeColor(response.status ?? 200)
    );

    const log = [mockedOrExecutedLabel, requestDetailsLabel, statusLabel];

    response.status && response.status >= 400
      ? logger.error(...log)
      : logger.info(...log);
  }

  handle: AcquireMiddlewareFn = (context) => {
    return this.logAcquireCall(this.logger, context);
  };
}
