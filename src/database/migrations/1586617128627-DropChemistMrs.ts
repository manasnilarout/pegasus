import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropChemistMrs1586617128627 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('chemist_mrs');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chemist_mrs\` (
            \`id\` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            \`chemist_id\` INT(10) UNSIGNED NOT NULL,
            \`mr_id\` BIGINT(20) UNSIGNED NOT NULL,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`chemist_id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_chemist_mr_chemist_chemist_id_idx\` (\`chemist_id\` ASC),
            INDEX \`fk_chemist_mr_user_user_id_idx\` (\`mr_id\` ASC),
            CONSTRAINT \`fk_chemist_mr_chemist_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`chemist_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_chemist_mr_user_user_id\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }
}
