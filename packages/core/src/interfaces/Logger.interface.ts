export interface Logger {
  log: (message: string, ...optionalParams: any[]) => void;
  info: (message: string, ...optionalParams: any[]) => void;
  warn: (message: string, ...optionalParams: any[]) => void;
  error: (message: string, ...optionalParams: any[]) => void;
}

export type LogLevel = "log" | "info" | "warning" | "error";
export type LoggerFn = (message?: any, ...optionalParams: any[]) => void;
