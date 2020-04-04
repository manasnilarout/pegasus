import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTokensTable1586010359704 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user_tokens\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`user_id\` BIGINT UNSIGNED NOT NULL,
            \`token\` VARCHAR(45) NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            UNIQUE INDEX \`token_UNIQUE\` (\`token\` ASC),
            INDEX \`fk_user_tokens_user_id_user_user_id_idx\` (\`user_id\` ASC),
            CONSTRAINT \`fk_user_tokens_user_id_user_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user_tokens');
    }

}
