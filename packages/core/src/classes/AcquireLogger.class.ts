import { LogLevel, Logger, LoggerFn } from "@/interfaces/Logger.interface";

export type AcquireLogColor = keyof typeof AcquireLogger.color;

export interface AcquireLoggerOptions {
  logFn?: LoggerFn;
  logLevels?: LogLevel[] | "all";
  timezone?: string;
}

export default class AcquireLogger implements Logger {
  private logFn: LoggerFn;
  private logLevels: LogLevel[] | "all";
  private timezone: string;

  constructor(options?: AcquireLoggerOptions) {
    const {
      logFn = console.log,
      logLevels = "all",
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } = options ?? {};
    this.logFn = logFn;
    this.logLevels = logLevels;
    this.timezone = timezone;
  }

  static color = {
    reset: "\x1b[0m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    brightBlack: "\x1b[90m",
    brightRed: "\x1b[91m",
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[95m",
    brightCyan: "\x1b[96m",
    brightWhite: "\x1b[97m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    bgBrightBlack: "\x1b[100m",
    bgBrightRed: "\x1b[101m",
    bgBrightGreen: "\x1b[102m",
    bgBrightYellow: "\x1b[103m",
    bgBrightBlue: "\x1b[104m",
    bgBrightMagenta: "\x1b[105m",
    bgBrightCyan: "\x1b[106m",
    bgBrightWhite: "\x1b[107m"
  };

  static style = {
    bold: "\x1b[1m",
    reset: "\x1b[0m"
  };

  static colorize(
    text: string,
    color: AcquireLogColor,
    reset: AcquireLogColor = "reset"
  ): string {
    return `${AcquireLogger.color[color]}${text}${AcquireLogger.color[reset]}`;
  }

  static emphasize(text: string): string {
    return `${AcquireLogger.style.bold}${text}${AcquireLogger.style.reset}`;
  }

  private now(): Date {
    const date = new Date();

    const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      timeZone: this.timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const parts = dateTimeFormat.formatToParts(date);

    const hours = parts.find((part) => part.type === "hour")?.value;
    const minutes = parts.find((part) => part.type === "minute")?.value;
    const seconds = parts.find((part) => part.type === "second")?.value;

    date.setHours(parseInt(hours || "0"));
    date.setMinutes(parseInt(minutes || "0"));
    date.setSeconds(parseInt(seconds || "0"));

    return date;
  }

  private makeLog(
    level: LogLevel,
    color: AcquireLogColor,
    ...args: any[]
  ): void {
    if (this.logLevels !== "all" && !this.logLevels.includes(level)) {
      return;
    }
    const levelPrefix = AcquireLogger.colorize("[Acquire]", color);

    function zeroPad(value: number): string {
      return value.toString().padStart(2, "0");
    }

    const timestamp = this.now();
    const timestampPrefix = AcquireLogger.colorize(
      `${zeroPad(timestamp.getDate())}/${zeroPad(
        timestamp.getMonth() + 1
      )}/${zeroPad(timestamp.getFullYear())} ${zeroPad(
        timestamp.getHours()
      )}:${zeroPad(timestamp.getMinutes())}:${zeroPad(timestamp.getSeconds())}`,
      "brightBlack"
    );

    const message = args.reduce((acc, curr, index) => {
      let text = curr;
      if (typeof curr === "object") {
        text = JSON.stringify(curr);
      }
      if (index === 0) {
        return text;
      }

      return `${acc} ${curr}`;
    }, "");

    this.logFn(
      `${AcquireLogger.color.reset}${levelPrefix} - ${timestampPrefix} - ${message}`
    );
  }

  public setLogLevels(logLevels: LogLevel[] | "all"): this {
    this.logLevels = logLevels;
    return this;
  }

  public log(...args: any[]): void {
    this.makeLog("log", "green", ...args);
  }

  public info(...args: any[]): void {
    this.makeLog("info", "blue", ...args);
  }

  public warn(...args: any[]): void {
    this.makeLog("warning", "yellow", ...args);
  }

  public error(...args: any[]): void {
    this.makeLog("error", "red", ...args);
  }
}
