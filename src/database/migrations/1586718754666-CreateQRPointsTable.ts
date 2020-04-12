import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQRPointsTable1586718754666 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`qr_points\` (
            \`id\` VARCHAR(45) NOT NULL,
            \`batch_number\` VARCHAR(45) NOT NULL,
            \`batch_quantity\` INT NOT NULL,
            \`product_id\` BIGINT UNSIGNED NOT NULL,
            \`points\` INT NOT NULL,
            \`valid_from\` DATETIME NOT NULL,
            \`valid_till\` DATETIME NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_on\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY (\`id\`, \`batch_number\`, \`batch_quantity\`),
            INDEX \`fk_qr_created_by_user_id_idx\` (\`created_by\` ASC),
            INDEX \`fk_qr_product_id_product_id_idx\` (\`product_id\` ASC),
            CONSTRAINT \`fk_qr_created_by_user_id\`
              FOREIGN KEY (\`created_by\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_qr_product_id_product_id\`
              FOREIGN KEY (\`product_id\`)
              REFERENCES \`product\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('qr_points');
    }
}
