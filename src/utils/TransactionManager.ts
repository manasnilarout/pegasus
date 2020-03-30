import { getNamespace } from 'cls-hooked';
import { EntityManager, getConnection } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

export class TransactionManager {

    public static get namespace(): string {
        return this._namespace;
    }

    public static set namespace(name: string) {
        this._namespace = name;
    }

    public static getEntityManager( connectionName: string ): EntityManager|void {
        const context = getNamespace(TransactionManager._namespace);
        if (context && context.active) {
            const transactionEntityManager: EntityManager =
                context.get(TransactionManager.getContextKeyName(connectionName));
            if (transactionEntityManager) {
                // At this point here we have successfully found a transactional EntityManager
                return transactionEntityManager;
            }
        }
        return;
    }

    public static async run<T>(
        originalMethod: (...args: any[]) => Promise<T>,
        connectionName: string = 'default',
        isolationLevel: IsolationLevel = 'READ COMMITTED'
    ): Promise<T> {
        const context = getNamespace( TransactionManager._namespace );

        if (!context) {
            throw new Error(
                `No CLS namespace defined in your app. Cannot use CLS transaction management.`
            );
        }

        if (!context.active) {
            throw new Error(
                `No active CLS context detected. Cannot use CLS transaction management.`
            );
        }

        const transactionEntityManager = context.get(
            TransactionManager.getContextKeyName(connectionName)
        );

        if (transactionEntityManager) {
            // Transaction is already running, just call the method.
            return await originalMethod.apply(this, []);
        }

        return await getConnection(connectionName).transaction(isolationLevel, async (entityManager) => {
            context.set(TransactionManager.getContextKeyName(connectionName), entityManager);
            try {
                return await originalMethod.apply(this, []);
            } finally {
                // We don't want to handle the error, just unset the context.
                context.set(TransactionManager.getContextKeyName(connectionName), undefined);
            }
        });
    }

    private static _namespace: string;

    private static readonly CONTEXT_KEY = '__typeorm_transaction_manager';

    private static getContextKeyName(connectionName: string): string {
        return `${TransactionManager.CONTEXT_KEY}_${connectionName}`;
    }

}
