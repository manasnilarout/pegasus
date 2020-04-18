import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPointsToChemistTable1587241180605 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD COLUMN \`points\` INT NOT NULL DEFAULT '0' AFTER \`shop_licence\`;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('chemist', 'points');
    }
}
