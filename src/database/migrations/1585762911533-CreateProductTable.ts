import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1585762911533 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`name\` VARCHAR(45) NOT NULL,
            \`brand\` VARCHAR(45) NULL,
            \`product_name\` VARCHAR(150) NULL,
            \`active_ingredients\` VARCHAR(200) NULL,
            \`product_type\` INT UNSIGNED NOT NULL,
            \`pack_type\` INT UNSIGNED NOT NULL,
            \`pack_size\` VARCHAR(20) NOT NULL,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_product_type_product_type_id_idx\` (\`product_type\` ASC),
            INDEX \`fk_pack_type_pack_type_id_idx\` (\`pack_type\` ASC),
            INDEX \`fk_created_by_user_user_id_idx\` (\`created_by\` ASC),
            CONSTRAINT \`fk_product_type_product_type_id\`
              FOREIGN KEY (\`product_type\`)
              REFERENCES \`product_type\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_pack_type_pack_type_id\`
              FOREIGN KEY (\`pack_type\`)
              REFERENCES \`pack_type\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_created_by_user_user_id\`
              FOREIGN KEY (\`created_by\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('product');
    }
}
