import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumnToProductTable1586097982953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`product\`
        ADD COLUMN \`status\` TINYINT NOT NULL DEFAULT 1 AFTER \`created_by\`;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('product', 'status');
    }

}
