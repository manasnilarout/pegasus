import { Logger } from 'caleido-lib/logger';
import { createMQTTClient, MQTTClientOpts } from 'caleido-lib/mqtt';
import * as cls from 'cls-hooked';
import glob from 'glob';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { RunInContextMiddleware } from '../api/mqtt/middlewares/RunInContextMiddleware';
import { config } from '../config';
import { env } from '../env';

export const mqttLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.mqtt.enabled) {
        cls.createNamespace(config.get('clsNamespace.name'));
        const patterns = env.mqtt.controllers;
        patterns.forEach((pattern) => {
            glob(pattern, (err: any, files: string[]) => {
                for (const file of files) {
                    require(file);
                }
            });
        });

        const clientOptions: MQTTClientOpts = {
            host: env.mqtt.host,
            port: env.mqtt.port,
            protocol: env.mqtt.protocol,
            protocolVersion: env.mqtt.protocolVersion,
            customHandler: RunInContextMiddleware,
        };

        const logger = new Logger('mqtt');

        const mqttClient = createMQTTClient(clientOptions, logger);

        // Establish connection with the broker
        await mqttClient.establishConnection();

        // Destroy connection with broker when shutting down
        settings.onShutdown(async () => await mqttClient.destroy());
    }

    // TODO: Use container(typedi)
};
