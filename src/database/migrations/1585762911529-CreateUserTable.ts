import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1585762911529 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user\` (
            \`user_id\` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            \`first_name\` VARCHAR(50) NOT NULL,
            \`last_name\` VARCHAR(50) NULL,
            \`username\` VARCHAR(50) NOT NULL,
            \`password\` VARCHAR(100) NOT NULL,
            \`phone\` VARCHAR(20) NOT NULL,
            \`secondary_phone\` VARCHAR(20) NULL,
            \`email\` VARCHAR(75) NULL,
            \`address_1\` VARCHAR(100) NOT NULL,
            \`address_2\` VARCHAR(100) NULL,
            \`city\` VARCHAR(15) NOT NULL,
            \`state\` VARCHAR(15) NOT NULL,
            \`country\` VARCHAR(15) NOT NULL DEFAULT 'India',
            \`pin\` VARCHAR(10) NOT NULL,
            \`status\` TINYINT(1) NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT(20) NULL,
            PRIMARY KEY (\`user_id\`),
            UNIQUE INDEX \`user_id_UNIQUE\` (\`user_id\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }

}
