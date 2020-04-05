import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChemistTable1585762911535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chemist\` (
            \`chemist_id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`name\` VARCHAR(50) NOT NULL,
            \`mobile\` VARCHAR(20) NOT NULL,
            \`head_quarter\` INT UNSIGNED NOT NULL,
            \`email\` VARCHAR(75) NULL,
            \`shop_phone\` VARCHAR(20) NULL,
            \`address\` VARCHAR(200) NOT NULL,
            \`city\` VARCHAR(20) NOT NULL,
            \`state\` INT UNSIGNED NOT NULL,
            \`pin\` VARCHAR(10) NOT NULL,
            \`doctor_name\` VARCHAR(50) NULL,
            \`chemist_speciality\` INT UNSIGNED NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY (\`chemist_id\`),
            UNIQUE INDEX \`chemist_id_UNIQUE\` (\`chemist_id\` ASC),
            INDEX \`fk_head_quarter_head_quarter_id_idx\` (\`head_quarter\` ASC),
            INDEX \`fk_state_state_id_idx\` (\`state\` ASC),
            INDEX \`fk_mr_user_user_id_idx\` (\`mr\` ASC),
            INDEX \`fk_chemist_speciality_speciality_id_idx\` (\`chemist_speciality\` ASC),
            INDEX \`fk_created_by_user_user_id_idx\` (\`created_by\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('chemist');
    }

}
