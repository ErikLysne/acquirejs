import {
  AcquireMiddlewareClass,
  AcquireMiddlewareFn
} from "@/classes/AcquireBase.class";
import AcquireLogger, {
  AcquireLogColor,
  AcquireLoggerOptions
} from "@/classes/AcquireLogger.class";
import RequestMethod from "@/constants/RequestMethod.const";
import { AcquireContext } from "@/interfaces/AcquireContext.interface";
import axios from "axios";

export interface RequestLoggerOptions extends AcquireLoggerOptions {
  order?: number;
}

export default class RequestLogger
  implements AcquireMiddlewareClass<any, any, any, any, any>
{
  public order;
  private logger: AcquireLogger;

  constructor(options?: RequestLoggerOptions) {
    const { order = 1000, ...rest } = options ?? {};
    this.logger = new AcquireLogger(rest);
    this.order = order;
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

  logAcquireCall(
    logger: AcquireLogger,
    context: AcquireContext<any, any, any, any, any>
  ): void {
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

  handle: AcquireMiddlewareFn<any, any, any, any, any> = (context) => {
    return this.logAcquireCall(this.logger, context);
  };
}
