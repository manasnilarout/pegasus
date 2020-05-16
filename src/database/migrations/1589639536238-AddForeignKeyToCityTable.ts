import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeignKeyToCityTable1589639536238 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKeys('city', [
            new TableForeignKey({
                name: 'fk_city_state_id',
                columnNames: ['state_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'states',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
            }),
            new TableForeignKey({
                name: 'fk_city_hq_id',
                columnNames: ['hq_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'head_quarters',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKeys('city', [
            new TableForeignKey({
                name: 'fk_city_state_id',
                columnNames: ['state_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'states',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
            }),
            new TableForeignKey({
                name: 'fk_city_hq_id',
                columnNames: ['hq_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'head_quarters',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
            }),
        ]);
    }
}
