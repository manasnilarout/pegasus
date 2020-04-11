import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserLoginTable1585762911530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`user_login_details\` (
            \`user_id\` BIGINT UNSIGNED NOT NULL,
            \`username\` VARCHAR(75) NOT NULL,
            \`password\` VARCHAR(100) NOT NULL,
            PRIMARY KEY (\`user_id\`),
            UNIQUE INDEX \`user_id_UNIQUE\` (\`user_id\` ASC),
            UNIQUE INDEX \`username_UNIQUE\` (\`username\` ASC),
            CONSTRAINT \`fk_user_id_user_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE CASCADE
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user_login_details');
    }

}
