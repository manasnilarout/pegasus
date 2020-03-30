import { RedisConnectionOpts, RedisDB } from 'caleido-lib/redis';
import { EventDispatcher } from 'event-dispatch';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import Container from 'typedi';

import { events } from '../api/subscribers/events';
import { config } from '../config';
import { env } from '../env';

export const redisLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.redis.enabled) {
        const redisConnectionOptions: RedisConnectionOpts = {
            host: env.redis.host,
            port: Number(env.redis.port),
        };
        const redis = new RedisDB();
        await redis.connect(redisConnectionOptions);
        redis.subscribe(config.get('redis.expiryEvent'));

        // Setting container before initiating service.
        Container.set('RedisClient', redis);

        const eventDispatcher = new EventDispatcher();

        redis.eventHandler('message', (channel: string, message: string) => {
            return new Promise((resolve) => {
                eventDispatcher.dispatch(events.Redis.KeyExpiry, message);
                return resolve();
            });
        });

        // Disconnect from redis when shutting down
        settings.onShutdown(async () => await redis.disconnect());
    }
};
