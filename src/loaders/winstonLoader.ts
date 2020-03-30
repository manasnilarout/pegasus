import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { configure, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { env } from '../env';

export const winstonLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    let errorTransport;
    let combinedTransport;
    const logDir = env.log.dir;
    const appName = env.app.name;

    if (env.isProduction) {
        errorTransport = new DailyRotateFile({
            level: 'error',
            dirname: logDir,
            filename: `${appName}-error-%DATE%.log`,
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
        });

        combinedTransport = new DailyRotateFile({
            level: env.log.level,
            dirname: logDir,
            filename: `${appName}-combined-%DATE%.log`,
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
        });
    } else {
        errorTransport = new DailyRotateFile({
            level: 'error',
            dirname: logDir,
            filename: `${appName}-error-dev-%DATE%.log`,
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
        });

        combinedTransport = new transports.Console({
            level: env.log.level,
            handleExceptions: true,
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.simple()
            ),
        });
    }

    configure({
        transports: [
            errorTransport,
            combinedTransport,
        ],
    });
};
