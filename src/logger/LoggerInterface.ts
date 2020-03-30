export interface LoggerInterface {
    debug(message: string, args?: any, logType?: string): void;
    info(message: string, args?: any, logType?: string): void;
    warn(message: string, args?: any, logType?: string): void;
    error(message: string, args?: any, logType?: string): void;
}
