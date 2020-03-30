import * as cls from 'cls-hooked';
import { env } from 'process';
import { LoggerInterface } from 'src/decorators/Logger';

import { config } from '../config';
import { ErrorResponse } from './ErrorResponse';

export class AppError extends Error {
    private requestId?: string;
    private code: string;
    private data: any;
    private status: 'fail' | 'error';
    private error?: Error;
    private httpStatusCode: number;

    public constructor(code: string, name: string, msg: string, status: 'fail' | 'error',
                       data?: any, error?: any, httpStatusCode?: number) {
        super();

        this.code = code;
        this.name = name;
        this.message = msg;
        this.status = status;
        this.requestId = this.getRequestId();
        this.data = {};

        if (data) {
            this.data = data;
        }

        if (error) {
            this.error = error;
        }

        if (httpStatusCode) {
            this.httpStatusCode = httpStatusCode;
        } else {
            this.httpStatusCode = this.isError() ? 500 : 400;
        }

    }

    public toShortString(): string {
        let str = '';
        str += `[${this.code}] ${this.name}: `;
        str += this.message;

        return str;
    }

    public toString(): string {
        let shortString = this.toShortString();
        if (this.data) {
            shortString += `Data: ${JSON.stringify(this.data)}`;
        }

        if (this.error) {
            shortString += `Error: ${this.error.name}: ${this.error.message}`;
            if (!env.isProduction) {
                shortString += `${this.error.stack}`;
            }
        }

        return shortString;
    }

    public toJSON(): ErrorResponse {
        const error: ErrorResponse = {
            code: this.code,
            message: `[${this.name}] ${this.message}`,
            status: this.status,
            data: {},
        };

        if (this.requestId) {
            error.requestId = this.requestId;
        }

        if (this.data) {
            error.data = this.data;
        }

        if (this.error) {
            error.data.__error = {};
            error.data.__error.message = this.error.message;
            error.data.__error.name = this.error.name;

            if (env.isProduction) {
                error.data.__error.stack = this.error.stack;
            }
        }

        return error;
    }

    public isFail(): boolean {
        return this.status === 'fail';
    }

    public isError(): boolean {
        return this.status === 'error';
    }

    public log(logger: LoggerInterface): void {
        let logLevel: 'error' | 'debug' | 'info' = 'error';
        if (this.status === 'fail') {
            logLevel = 'debug';
        }
        logger[logLevel](this.toShortString(), {
            error: this.error || {},
            data: this.data || {},
        });
    }

    public getHttpStatusCode(): number {
        return this.httpStatusCode;
    }

    private getRequestId(): string|undefined {
        const namespace = config.get('clsNamespace.name');
        const clsNamespace: cls.Namespace = cls.getNamespace(namespace);
        if (clsNamespace) {
            return clsNamespace.get('requestID');
        }
        return undefined;
    }
}
