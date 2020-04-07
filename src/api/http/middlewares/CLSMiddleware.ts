import * as cls from 'cls-hooked';
import * as express from 'express';
import { nanoid } from 'nanoid/async';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { config } from '../../../config';

@Middleware({ type: 'before' })
export class CLSMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
        // req and res are event emitters. We want to access CLS context inside of their event callbacks
        const clsNamespace: cls.Namespace = cls.getNamespace(config.get('clsNamespace.name'));
        clsNamespace.bindEmitter(res);
        clsNamespace.bindEmitter(req);
        clsNamespace.run(async () => {
            let requestId = await nanoid(10);

            // Check if namespace is passed from caller component
            if (req.headers && req.headers.requestid) {
                requestId = req.headers.requestid as string;
            }
            clsNamespace.set('requestID', requestId);
            next();
        });
    }
}
