import { Connection } from 'typeorm/connection/Connection';
import { Migration } from 'typeorm/migration/Migration';

export class MigrationHelper {
    private _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    public async runMigrations(): Promise<Migration[]> {
        return this._connection.runMigrations();
    }

    public async undoMigrations(numSteps?: number): Promise<void> {
        if (numSteps === undefined || numSteps <= 0 || isNaN(numSteps)) {
            await this._connection.undoLastMigration();
            return;
        }

        for (let i = 0; i < numSteps; i++) {
            await this._connection.undoLastMigration();
        }
    }

    public async showMigrations(): Promise<boolean> {
        return await this._connection.showMigrations();
    }

    public async dropSchema(): Promise<void> {
        return await this._connection.dropDatabase();
    }
}
