import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
    getOsEnv, getOsEnvOptional, getOsPath, getOsPaths, normalizePort, toBool, toNumber
} from './utils/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        publicBasePath: getOsEnv('PUBLIC_BASE_PATH'),
        publicRoute: getOsEnv('PUBLIC_ROUTE'),
         dirs: {
            migrations: getOsPaths('TYPEORM_MIGRATIONS'),
            migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
            entities: getOsPaths('TYPEORM_ENTITIES'),
            controllers: getOsPaths('HTTP_CONTROLLERS'),
            middlewares: getOsPaths('HTTP_MIDDLEWARES'),
            interceptors: getOsPaths('HTTP_INTERCEPTORS'),
            subscribers: getOsPaths('SUBSCRIBERS'),
            resolvers: getOsPaths('RESOLVERS'),
            tempDir: getOsPath('TEMP_DIR'),
            templates: getOsPath('TEMPLATES_DIR'),
            publicDir: getOsEnv('PUBLIC_DIR'),
            attachment: getOsEnv('ATTACHMENT_DIR'),
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
        dir: getOsEnv('LOG_DIR'),
    },
    db: {
        type: getOsEnv('TYPEORM_CONNECTION'),
        host: getOsEnvOptional('TYPEORM_HOST'),
        port: toNumber(getOsEnvOptional('TYPEORM_PORT')),
        username: getOsEnvOptional('TYPEORM_USERNAME'),
        password: getOsEnvOptional('TYPEORM_PASSWORD'),
        database: getOsEnv('TYPEORM_DATABASE'),
        synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE')),
        logging: getOsEnv('TYPEORM_LOGGING'),
        logger: getOsEnv('TYPEORM_LOGGER'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        file: getOsEnv('SWAGGER_FILE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
    mqtt: {
        enabled: toBool(getOsEnv('MQTT_ENABLED')),
        protocol: getOsEnv('MQTT_PROTOCOL'),
        protocolVersion: toNumber(getOsEnv('MQTT_PROTOCOL_VERSION')),
        host: getOsEnv('MQTT_HOST') as 'mqtt' | 'mqtts',
        port: toNumber(getOsEnv('MQTT_PORT')),
        controllers: getOsPaths('MQTT_CONTROLLERS'),
    },
    amqp: {
        enabled: toBool(getOsEnv('AMQP_ENABLED')),
        protocol: getOsEnv('AMQP_PROTOCOL'),
        host: getOsEnv('AMQP_HOST'),
        port: toNumber(getOsEnv('AMQP_PORT')),
        controllers: getOsPaths('AMQP_CONTROLLERS'),
    },
    redis: {
        enabled: toBool(getOsEnv('REDIS_ENABLED')),
        host: getOsEnv('REDIS_HOST'),
        port: getOsEnv('REDIS_PORT'),
    },
    prometheusMetrics: {
        enabled: toBool(getOsEnvOptional('ENABLE_METRICS')),
    },
    fovea: {
        sms: {
            endPoint: getOsEnv('FOVEA_SMS_END_POINT'),
            auth: getOsEnv('FOVEA_SMS_AUTH_KEY'),
            sender: getOsEnv('FOVEA_SMS_SENDER'),
        },
    },
};
