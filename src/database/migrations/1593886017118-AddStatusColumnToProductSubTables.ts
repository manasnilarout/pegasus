import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumnToProductSubTables1593886017118 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`product_type\`
        ADD COLUMN \`status\` TINYINT NOT NULL DEFAULT 1 AFTER \`name\`;
        `);

        await queryRunner.query(`
        ALTER TABLE \`pack_type\`
        ADD COLUMN \`status\` TINYINT NOT NULL DEFAULT 1 AFTER \`name\`;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('product_type', 'status');
        await queryRunner.dropColumn('pack_type', 'status');
    }
}
