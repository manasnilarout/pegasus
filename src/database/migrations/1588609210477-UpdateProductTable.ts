import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductTable1588609210477 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`product\`
        ADD COLUMN \`points\` INT NOT NULL DEFAULT '0' AFTER \`pack_type\`;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('product', 'points');
    }
}
