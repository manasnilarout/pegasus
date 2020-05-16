import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCityTable1589639159866 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`city\`
        ADD COLUMN \`state_id\` INT UNSIGNED NOT NULL DEFAULT '1' AFTER \`id\`,
        ADD COLUMN \`hq_id\` INT UNSIGNED NOT NULL DEFAULT '1' AFTER \`state_id\`,
        ADD COLUMN \`status\` TINYINT NOT NULL DEFAULT '1' AFTER \`name\`,
        DROP PRIMARY KEY,
        ADD PRIMARY KEY (\`id\`, \`state_id\`, \`hq_id\`);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns('city', [
            new TableColumn({ name: 'state_id', type: 'int' }),
            new TableColumn({ name: 'hq_id', type: 'int' }),
            new TableColumn({ name: 'status', type: 'tinyint' }),
        ]);
    }
}
