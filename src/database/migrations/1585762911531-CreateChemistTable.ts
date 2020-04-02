import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChemistTable1585762911531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chemist\` (
            \`chemist_id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`user_id\` BIGINT(20) UNSIGNED NOT NULL,
            \`chemist_shop_name\` VARCHAR(30) NOT NULL,
            \`chemist_shop_phone_1\` VARCHAR(20) NOT NULL,
            \`chemist_shop_phone_2\` VARCHAR(20) NULL,
            \`address_1\` VARCHAR(50) NOT NULL,
            \`address_2\` VARCHAR(50) NULL,
            \`city\` VARCHAR(20) NOT NULL,
            \`state\` VARCHAR(20) NOT NULL,
            \`country\` VARCHAR(20) NOT NULL,
            \`pin\` VARCHAR(10) NOT NULL,
            \`status\` TINYINT(1) NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT(20) NULL,
            PRIMARY KEY (\`chemist_id\`),
            INDEX \`fk_chemist_user_id_user_user_id_idx\` (\`user_id\` ASC),
            UNIQUE INDEX \`chemist_id_UNIQUE\` (\`chemist_id\` ASC),
            CONSTRAINT \`fk_chemist_user_id_user_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('chemist');
    }

}
