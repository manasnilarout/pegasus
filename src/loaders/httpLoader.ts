import * as express from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';
import { useExpressServer } from 'routing-controllers';

import { config } from '../config';
import { env } from '../env';

export const httpLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const expressApp: express.Application = settings.getData('express_app');

        // @TODO Convert require to import.
        // Importing and not using apiMetrics() causes it to call /metrics continuously.
        if (env.prometheusMetrics.enabled) {
            const apiMetrics = require('prometheus-api-metrics');
            const options = config.get('prometheusMetricsOption');
            expressApp.use(apiMetrics(options));
        }

        // Add route to serve static files
        expressApp.use(
            env.app.publicRoute,
            express.static(path.join(__dirname, '../..', env.app.dirs.publicDir),
            {
                maxAge: config.get('publicAsset.maxAge'),
            }
        ));

        // Attach controllers and middlewares to the existing express instance.
        useExpressServer(expressApp, {
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
            /**
             * We can add options about how routing-controllers should configure itself.
             * Here we specify what controllers should be registered in our express server.
             */
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            interceptors: env.app.dirs.interceptors,

            /**
             * Authorization features
             */
            authorizationChecker: undefined,
            currentUserChecker: undefined,
        });
    }
};
