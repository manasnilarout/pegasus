import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStateTable1589637814610 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`head_quarters\`
        ADD COLUMN \`state_id\` INT UNSIGNED NOT NULL DEFAULT '1' AFTER \`id\`,
        ADD COLUMN \`status\` TINYINT UNSIGNED NOT NULL DEFAULT '1' AFTER \`name\`,
        DROP PRIMARY KEY,
        ADD PRIMARY KEY (\`id\`, \`state_id\`, \`name\`),
        ADD INDEX \`fk_hq_state_id_idx\` (\`state_id\` ASC);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`head_quarters\`
        DROP COLUMN \`status\`,
        DROP COLUMN \`state_id\`,
        DROP PRIMARY KEY,
        ADD PRIMARY KEY (\`id\`),
        DROP INDEX \`fk_hq_state_id_idx\` ;
`);
    }
}
