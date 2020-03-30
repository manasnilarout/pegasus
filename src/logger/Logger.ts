import * as path from 'path';
import * as winston from 'winston';

import { LoggerInterface } from '../LoggerInterface';
import { LoggerOptions } from '../types';

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

export class Logger implements LoggerInterface {

    public static DEFAULT_SCOPE = 'app';

    private static parsePathToScope(filePath: string): string {
        if (filePath.indexOf(path.sep) >= 0) {
            filePath = filePath.replace(process.cwd(), '');
            filePath = filePath.replace(`${path.sep}src${path.sep}`, '');
            filePath = filePath.replace(`${path.sep}dist${path.sep}`, '');
            filePath = filePath.replace('.ts', '');
            filePath = filePath.replace('.js', '');
            filePath = filePath.replace(path.sep, ':');
        }
        return filePath;
    }

    private scope: string;
    private options: LoggerOptions;
    private defaultLogType: string;

    constructor(scope?: string, options?: LoggerOptions, logType?: string) {
        this.scope = Logger.parsePathToScope((scope) ? scope : Logger.DEFAULT_SCOPE);
        this.options = options || {};
        this.defaultLogType = logType || 'default';
    }

    public debug(message: string, args?: any, logType?: string): void {
        this.log('debug', message, args, logType);
    }

    public info(message: string, args?: any, logType?: string): void {
        this.log('info', message, args, logType);
    }

    public warn(message: string, args?: any, logType?: string): void {
        this.log('warn', message, args, logType);
    }

    public error(message: string, args?: any, logType?: string): void {
        this.log('error', message, args, logType);
    }

    private log(level: string, message: string, args: any, logType: string): void {
        let requestID = '';
        if (this.options.hasOwnProperty('getRequestID')) {
            requestID = this.options.getRequestID();
        }
        if (winston) {
            args = { data: args } || {};
            args.type = logType || this.defaultLogType;
            winston[level](`${this.formatMessage(requestID)} ${message}`, args);
        }
    }

    private formatMessage(requestID: string): string {
        if (requestID) {
            return `[ReqID: ${requestID}] [${this.scope}]`;
        }
        return `[${this.scope}]`;
    }

}
