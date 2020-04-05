import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { config } from '../../../config';
import { Logger, LoggerInterface } from '../../../decorators/Logger';

@Middleware({ type: 'after' })
export class RouteNotFoundMiddleware implements ExpressMiddlewareInterface {
    constructor(
        @Logger('ErrorMiddleware', config.get('clsNamespace.name')) private log: LoggerInterface
    ) { }

    public use(req: Request, res: Response): void {
        if (!res.headersSent) {
            this.log.info('RouteNotFoundMiddleware reached, ending response.');

            // Since headers haven't been sent yet, we can assume that no route was matched.
            res.status(404);
            res.send({
                code: 404,
                message: `Route not found - ${req.path}`,
                status: 'fail',
            });
        }

        res.end();
    }
}
