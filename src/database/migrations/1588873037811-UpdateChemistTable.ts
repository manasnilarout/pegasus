import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateChemistTable1588873037811 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD COLUMN \`shop_name\` VARCHAR(45) NOT NULL DEFAULT '-' AFTER \`shop_phone\`;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('chemist', 'shop_name');
    }
}
