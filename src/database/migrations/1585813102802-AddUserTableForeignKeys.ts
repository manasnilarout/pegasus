import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddUserTableForeignKeys1585813102802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKeys('user', [
            new TableForeignKey({
                name: 'fk_user_id_mr_user_id',
                columnNames: ['user_id'],
                referencedColumnNames: ['user_id'],
                referencedTableName: 'medical_representative',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
            new TableForeignKey({
                name: 'fk_user_id_chemist_ser_id',
                columnNames: ['user_id'],
                referencedColumnNames: ['user_id'],
                referencedTableName: 'chemist',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('medical_representative', 'fk_mr_user_id_user_user_id');
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_user_id_user_user_id');
    }

}
