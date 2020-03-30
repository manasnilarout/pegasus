import { ValidationOptions } from 'class-validator';

import { LoggerInterface } from '../decorators/Logger';
import { AppError, AppRuntimeError } from '../errors';

export class AppService {
    private _log: LoggerInterface;

    protected constructor(log?: LoggerInterface) {
        this._log = log;
    }

    protected classifyError(e: Error, code: string, msg: string, data?: any): AppError {
        if (e instanceof AppError) {
            return e;
        } else {
            return new AppRuntimeError(code, msg, e, data);
        }
    }

    protected getDefaultValidationOpts(customOpts?: ValidationOptions): ValidationOptions {
        return Object.assign({
            skipMissingProperties: false,
            forbidUnknownValues: true,
            validationError: {
                target: false,
            },
        }, customOpts);
    }

    protected handleError(err: Error, code: string, msg: string): AppError {
        const error = this.classifyError(err, code, msg);
        if (this._log) {
            error.log(this._log);
        }
        return error;
    }
}
