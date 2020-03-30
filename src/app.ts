import 'reflect-metadata';

import { bootstrapMicroframework, MicroframeworkLoader } from 'microframework-w3tec';
import { Connection } from 'typeorm';

import { amqpLoader } from './loaders/amqpLoader';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { expressLoader } from './loaders/expressLoader';
import { homeLoader } from './loaders/homeLoader';
import { httpLoader } from './loaders/httpLoader';
import { iocLoader } from './loaders/iocLoader';
import { monitorLoader } from './loaders/monitorLoader';
import { mqttLoader } from './loaders/mqttLoader';
import { redisLoader } from './loaders/redisLoader';
import { swaggerLoader } from './loaders/swaggerLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { winstonLoader } from './loaders/winstonLoader';
import { Logger } from './logger';
import { banner } from './utils/banner';
import { MigrationHelper } from './utils/migration.util';

/**
 * node-starter-boilerplate
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);
let loaders: MicroframeworkLoader[];
let isMigrationCommand = false;

const args = process.argv.slice(2);
if (
    args.includes('migration:run') ||
    args.includes('migration:revert')
) {
    loaders = [
        winstonLoader,
        typeormLoader,
    ];
    isMigrationCommand = true;
} else {
    loaders = [
        // Important to maintain the loading order of express routes and middlewares
        winstonLoader,
        iocLoader,
        eventDispatchLoader,
        typeormLoader,
        expressLoader,
        swaggerLoader,
        monitorLoader,
        homeLoader,
        httpLoader,
        redisLoader,
        mqttLoader,
        amqpLoader,
    ];
}

bootstrapMicroframework({
    /**
     * Loader is a place where you can configure all your modules during microframework
     * bootstrap process. All loaders are executed one by one in a sequential order.
     */
    loaders,
}).then(async (framework) => {

    if (isMigrationCommand) {
        await handleMigrations(framework.settings.getData('connection'));
        process.exit(0);
    }

    log.info(`Process ID: ${process.pid}`);
    banner(log);
}).catch((error) => {
    log.error('Application has crashed: ' + error);
    process.exit(1);
});

async function handleMigrations(connection: Connection): Promise<void> {
    try {
        const migrationHelper = new MigrationHelper(connection);
        if (args.includes('migration:run')) {
            const pendingMigrations = await migrationHelper.showMigrations();

            if (!pendingMigrations) {
                log.info('No pending migrations were found');
                process.exit(0);
            }

            // Run pending migrations
            await migrationHelper.runMigrations();

            log.info('Ran pending migrations');
            process.exit(0);
        } else if (args.includes('migration:revert')) {
            const numStepsArg = parseInt(args[1], 10);
            const numSteps = args.length > 1 && !isNaN(numStepsArg) ? numStepsArg : 0;
            await migrationHelper.undoMigrations(numSteps);
            log.info(`Undo ${numSteps} migrations succeeded.`);
        } else if (args.includes('migration:drop-schema')) {
            await migrationHelper.dropSchema();
            process.exit(0);
        }
    } catch (err) {
        log.error('There was an error while running migrations.', err);
        process.exit(1);
    }
}
