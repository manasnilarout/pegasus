import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOTPTable1586526929075 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`otp\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`user_id\` BIGINT UNSIGNED NOT NULL,
            \`otp\` VARCHAR(6) NOT NULL,
            \`status\` TINYINT NOT NULL,
            \`reason\` ENUM('password-reset', 'redeem-points') NULL
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_otp_user_id_user_user_id_idx\` (\`user_id\` ASC),
            CONSTRAINT \`fk_otp_user_id_user_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('otp');
    }
}
