import { AMQPClientOpts, AMQPHandler, createAMQPClient } from 'caleido-lib/amqp';
import { Logger } from 'caleido-lib/logger';
import * as cls from 'cls-hooked';
import glob from 'glob';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';

import { RunInContextMiddleware } from '../api/amqp/middlewares/RunInContextMiddleware';
import { config } from '../config';
import { env } from '../env';

export const amqpLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.amqp.enabled) {
        cls.createNamespace(config.get('clsNamespace.name'));
        const patterns = env.amqp.controllers;
        patterns.forEach((pattern) => {
            glob(pattern, (err: any, files: string[]) => {
                for (const file of files) {
                    require(file);
                }
            });
        });

        const clientOptions: AMQPClientOpts = {
            protocol: env.amqp.protocol,
            hostname: env.amqp.host,
            port: env.amqp.port,
            container: Container,
            customHandler: RunInContextMiddleware,
        };

        const logger = new Logger('amqp');

        const amqpClient = createAMQPClient(clientOptions, logger);

        // Setting a container that can be used throughout the application
        Container.set(AMQPHandler, amqpClient);

        // Establish connection with the broker
        await amqpClient.establishConnection();

        // Disconnect from amqp when shutting down
        settings.onShutdown(async () => await amqpClient.disconnect());
    }
};
