import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMrTable1586617560735 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`mr\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`user_id\` BIGINT UNSIGNED NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`, \`user_id\`),
            UNIQUE INDEX \`user_id_UNIQUE\` (\`user_id\` ASC),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            CONSTRAINT \`fk_mr_user_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE CASCADE
              ON UPDATE CASCADE)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('mr');
    }
}
