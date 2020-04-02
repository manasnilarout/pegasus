import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createConnection, getConnectionOptions } from 'typeorm';
import { MysqlDriver } from 'typeorm/driver/mysql/MysqlDriver';

import { config } from '../config';
import { env } from '../env';
import { TransactionManager } from '../utils/TransactionManager';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {

    const loadedConnectionOptions = await getConnectionOptions();

    const connectionOptions = Object.assign(loadedConnectionOptions, {
        type: env.db.type as any, // See createConnection options for valid types
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        timezone: config.get('typeORM.mysql.timezone'),
        synchronize: env.db.synchronize,
        logging: env.db.logging,
        logger: env.db.logger,
        entities: env.app.dirs.entities,
        migrations: env.app.dirs.migrations,
    });

    const connection = await createConnection(connectionOptions);

    // @TODO This is an alternative solution
    // https://github.com/typeorm/typeorm/issues/2939#issuecomment-430597731
    (connection.driver as MysqlDriver).pool.on('acquire', (conn) => {
        conn.query('SET @@session.time_zone = ?', [config.get('typeORM.mysql.timezone')]);
    });

    // Setup namespace to be used by the TransactionManager
    TransactionManager.namespace = config.get('clsNamespace.name');

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.close());
    }
};
