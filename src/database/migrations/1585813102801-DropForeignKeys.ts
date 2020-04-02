import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropForeignKeys1585813102801 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('medical_representative', 'fk_mr_user_id_user_user_id');
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_user_id_user_user_id');
    }

    // tslint:disable-next-line: no-empty
    public async down(queryRunner: QueryRunner): Promise<any> { }

}
