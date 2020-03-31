import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';

import { RedisConnectionOpts } from './RedisConnectionOpts';
import { ICache } from './RedisDBCache';

export class RedisDB implements ICache {
    public onSubscription: (channel: string, message: string) => Promise<void>;
    public onEventTrigger: (channel: string, message: string) => Promise<void>;

    protected _connectionOptions: RedisConnectionOpts;
    private client: RedisClient;
    private getAsync: (key: string) => Promise<any>;
    private setAsync: (arg1: string, arg2: string) => Promise<{}>;
    private hsetAsync: (arg1: string, arg2: string, arg3: string) => Promise<number>;
    private hgetAsync: (key: string, field: string) => Promise<string>;
    private delAsync: (arg: string | string[]) => Promise<number>;
    private _redisPublisher: RedisClient;
    private _redisSubscriber: RedisClient;
    private subscriber: RedisClient;

    get publisherClient(): RedisClient {
        this._redisPublisher = this._connectionOptions
            ? createClient(this._connectionOptions) : createClient();
        return this._redisPublisher;
    }

    get subscriberClient(): RedisClient {
        this._redisSubscriber = this._connectionOptions
            ? createClient(this._connectionOptions) : createClient();
        return this._redisSubscriber;
    }

    constructor(
        onSubscriptionMethod?: (channel: string, message: string) => Promise<void>
    ) {
        this.onSubscription = onSubscriptionMethod
            ? onSubscriptionMethod : this.onSubscriptionDefault;
        // Set default subscriber client
        this.subscriber = this.subscriberClient;
    }

    public connect(opts?: RedisConnectionOpts): Promise<RedisClient> {
        return new Promise((resolve, reject) => {
            this._connectionOptions = opts;
            this.client = this._connectionOptions
                ? createClient(this._connectionOptions) : createClient();
            const that = this;
            this.client.on('connect', () => {
                that.initiateAllMethods();
                resolve(that.client);
            }).on('error', (e) => {
                that.onError(e);
                reject(e);
            });
        });
    }

    /**
     * Method to get values from RedisDB
     * @param key It is either a string or an array of strings for which value needs be fetched.
     */
    public async get(key: string | string[])
        : Promise<any> {
        try {
            if (typeof key === 'string') {
                return await this.getAsync(key);
            } else {
                const values: Array<{ key: string, value: string }> = [];
                for (const keyField of key) {
                    values.push({
                        key: keyField,
                        value: await this.getAsync(keyField),
                    });
                }
                return values;
            }
        } catch (err) {
            this.onError(err);
            throw err;
        }
    }

    /**
     * Method to set a property in RedisDB
     * All the values that are stored inside redis are stringified
     * @param arg It is an object where key will be redis key and value can be anything
     */
    public async set(key: string, value: string): Promise<void> {
        try {
            await this.setAsync(key, value);
        } catch (e) {
            this.onError(e);
            throw e;
        }
    }

    /**
     * Method to set key with some expiry time.
     * @param key redis key name
     * @param value redis value to be set for the key
     * @param duration duration for the key to be stored in redis
     */
    public async setKeyWithTTL(key: string, value: string, duration?: number): Promise<void> {
        try {
            await this.set(key, value);
            await this.setKeyExpiry(key, duration);
        } catch (err) {
            this.onError(err);
            throw err;
        }
    }

    /**
     * Method to get the redis key value and time to live period if expiry is set.
     * @param key redis key name
     */
    public async getKeyWithTTL(key: string): Promise<{ value: string, timeToLive: number }> {
        try {
            const value = await this.get(key);
            const timeToLive = await this.useRedisMethod('TTL', [key]);
            return { value, timeToLive };
        } catch (err) {
            this.onError(err);
            throw err;
        }
    }

    /**
     * Method to set time to live period in redis.
     * @param key redis key name
     * @param duration duration of the key to live in redis
     */
    public async setKeyExpiry(key: string, duration: number = 15)
        : Promise<void> {
        try {
            return await this.useRedisMethod('EXPIRE', [key, duration]);
        } catch (err) {
            this.onError(err);
            throw err;
        }
    }

    /**
     * Promisified method to set value using key and hashed field from RedisDB
     * @param key The primary key that needs to be set
     * @param field Hash field to be stored
     * @param value Value(of any type) to be stored
     */
    public async hset(key: string, field: string, value: any): Promise<void> {
        try {
            await this.hsetAsync(key, field, JSON.stringify(value));
        } catch (e) {
            this.onError(e);
            throw e;
        }
    }

    /**
     * Promisified method to get value using key and hashed field from RedisDB
     * @param key The primary key that needs to be set
     * @param field Hash field to be stored
     * @returns Parsed value stored in RedisDB
     */
    public async hget(key: string, field: string): Promise<any> {
        try {
            return JSON.parse(await this.hgetAsync(key, field));
        } catch (e) {
            this.onError(e);
            throw e;
        }
    }

    /**
     * Method to delete keys from RedisDB
     * @param arg Keys that needs to be removed, it can be a string or an array of strings
     */
    public async del(arg: string | string[]): Promise<number | void> {
        try {
            if (Array.isArray(arg)) {
                // @ts-ignore
                return await this.delAsync(...arg);
            }
            return await this.delAsync(arg);
        } catch (e) {
            this.onError(e);
            throw e;
        }
    }

    /**
     * Method to disconnect redis connection
     */
    public async disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.quit((err) => {
                if (err) {
                    this.onError(err);
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * Method to generalize all the functions provided by redisdb.
     * @param methodName Method name that needs to be performed on RedisDB
     * @param methodArguments Array of arguments that needs be passed to the method
     */
    public async useRedisMethod(methodName: string, methodArguments: any[]): Promise<any> {
        try {
            const methodDef = promisify(this.client[methodName]).bind(this.client);
            const results = await methodDef(...methodArguments);
            return results;
        } catch (e) {
            this.onError(e);
            throw e;
        }
    }

    public async subscribe(channel: string)
        : Promise<void> {
        this.subscriber.subscribe(channel);
        await this.eventHandler('subscribe', this.onSubscription);
    }

    public async eventHandler(
        event: 'message' | 'subscribe' | 'unsubscribe',
        cb: (channel: string, message: string) => Promise<void>
    ): Promise<any> {
        this.subscriber.on(event, cb);
    }

    private async onSubscriptionDefault(channel: string, message: string): Promise<void> {
        return new Promise((resolve) => {
            return resolve();
        });
    }

    private initiateAllMethods(): void {
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.hsetAsync = promisify(this.client.hset).bind(this.client);
        this.hgetAsync = promisify(this.client.hget).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    private onError(err: Error): void {
        // TODO: Need to handle the error
    }
}
