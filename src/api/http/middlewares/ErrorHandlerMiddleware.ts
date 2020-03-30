import * as express from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

import { config } from '../../../config';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { env } from '../../../env';
import { AppError, AppRuntimeError } from '../../../errors';
import { AppErrorCodes as ErrorCodes } from '../../../errors/codes';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    public isProduction = env.isProduction;

    constructor(
        @Logger('ErrorMiddleware', config.get('clsNamespace.name')) private log: LoggerInterface
    ) { }

    public error(error: Error, req: express.Request, res: express.Response, next: express.NextFunction): void {
        let appError: AppError;
        if (error instanceof AppError) {
            appError = error;
        } else {
            appError = new AppRuntimeError(
                ErrorCodes.unknownError.id, ErrorCodes.unknownError.msg, error, {
                    path: req.path,
                    method: req.method,
                });
        }

        if (appError.isError()) {
            // Log the error and the request.
            this.log.error(appError.toShortString(), {
                path: req && req.path,
                body: req && req.body,
                params: req && req.params,
                method: req && req.method,
            });
        }

        res.status(appError.getHttpStatusCode());
        res.json(appError.toJSON());
    }

}
