import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCityFieldUserTable1586617731303 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`user\`
        CHANGE COLUMN \`city\` \`city\` INT UNSIGNED NOT NULL ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`user\`
        CHANGE COLUMN \`city\` \`city\` VARCHAR(50) NOT NULL ;
        `);
    }
}
