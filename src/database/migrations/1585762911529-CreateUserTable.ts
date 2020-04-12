import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1585762911529 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user\` (
            \`user_id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`first_name\` VARCHAR(50) NOT NULL,
            \`email\` VARCHAR(75) NULL,
            \`phone\` VARCHAR(20) NOT NULL,
            \`alt_phone\` VARCHAR(20) NULL,
            \`designation\` ENUM('mr', 'chemist', 'admin') NOT NULL,
            \`head_quarter\` INT UNSIGNED NOT NULL,
            \`city\` VARCHAR(30) NOT NULL,
            \`state\` INT UNSIGNED NOT NULL,
            \`address\` VARCHAR(150) NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_by\` BIGINT UNSIGNED NULL,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`user_id\`),
            UNIQUE INDEX \`user_id_UNIQUE\` (\`user_id\` ASC),
            INDEX \`fk_head_quarter_head_quarter_id_idx\` (\`head_quarter\` ASC),
            INDEX \`fk_state_state_id_idx\` (\`state\` ASC),
            CONSTRAINT \`fk_head_quarter_head_quarter_id\`
              FOREIGN KEY (\`head_quarter\`)
              REFERENCES \`head_quarters\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_state_state_id\`
              FOREIGN KEY (\`state\`)
              REFERENCES \`states\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }

}
