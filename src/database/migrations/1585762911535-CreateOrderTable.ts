import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1585762911535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`orders\` (
            \`order_id\` BIGINT(20) UNSIGNED NOT NULL,
            \`mr_id\` INT UNSIGNED NOT NULL,
            \`chemist_id\` INT UNSIGNED NOT NULL,
            \`item_id\` INT UNSIGNED NOT NULL,
            \`orderscol\` VARCHAR(45) NULL,
            PRIMARY KEY (\`order_id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`order_id\` ASC),
            INDEX \`fk_order_mr_id_mr_mr_id_idx\` (\`mr_id\` ASC),
            INDEX \`fk_order_chemist_id_chemist_chemist_id_idx\` (\`chemist_id\` ASC),
            INDEX \`fk_order_item_id_item_item_id_idx\` (\`item_id\` ASC),
            CONSTRAINT \`fk_order_mr_id_mr_mr_id\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`medical_representative\` (\`mr_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_order_chemist_id_chemist_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`chemist_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_order_item_id_item_item_id\`
              FOREIGN KEY (\`item_id\`)
              REFERENCES \`item\` (\`item_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('orders');
    }

}
