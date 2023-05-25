import { LogLevel, Logger, LoggerFn } from "@/interfaces/Logger.interface";

export type AcquireLogColor = keyof typeof AcquireLogger.colors;

export default class AcquireLogger implements Logger {
  constructor(
    private logFn: LoggerFn = console.log,
    private logLevels: LogLevel[] | "all" = "all"
  ) {
    this.logFn = logFn;
    this.logLevels = logLevels;
  }

  static colors = {
    reset: "\x1b[0m",
    gray: "\x1b[90m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    black: "\x1b[30m",
    brightRed: "\x1b[91m",
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[95m",
    brightCyan: "\x1b[96m",
    brightWhite: "\x1b[97m"
  };

  static colorize(
    text: string,
    color: AcquireLogColor,
    reset: AcquireLogColor = "reset"
  ): string {
    return `${AcquireLogger.colors[color]}${text}${AcquireLogger.colors[reset]}`;
  }

  private makeLog(
    level: LogLevel,
    color: AcquireLogColor,
    ...args: any[]
  ): void {
    if (this.logLevels !== "all" && !this.logLevels.includes(level)) {
      return;
    }
    const levelPrefix = `[${AcquireLogger.colorize(
      `acquire:${level.toUpperCase()}`,
      color
    )}]`;
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

    this.logFn(`${levelPrefix} ${message}`);
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
