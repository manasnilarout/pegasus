import { EntityManager, ObjectLiteral, Repository } from 'typeorm';

import { TransactionManager } from '../utils/TransactionManager';

export class AppRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    private _connectionName = 'default';
    private _manager: EntityManager | undefined;

    set manager(manager: EntityManager) {
        this._manager = manager;
        this._connectionName = manager.connection.name;
    }

    get manager(): EntityManager {
        const entityManager = TransactionManager.getEntityManager(this._connectionName);
        if ( entityManager ) {
            return entityManager;
        }
        return this._manager;
    }
}
