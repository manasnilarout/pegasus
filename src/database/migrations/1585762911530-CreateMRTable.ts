import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMRTable1585762911530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`medical_representative\` (
            \`mr_id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`user_id\` BIGINT(20) UNSIGNED NOT NULL,
            \`total_claims\` INT NULL,
            \`total_order_amount\` INT NULL,
            \`status\` TINYINT(1) NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`mr_id\`),
            INDEX \`fk_mr_mr_id_user_user_id_idx\` (\`user_id\` ASC),
            UNIQUE INDEX \`mr_id_UNIQUE\` (\`mr_id\` ASC),
            CONSTRAINT \`fk_mr_user_id_user_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('medical_representative');
    }

}
