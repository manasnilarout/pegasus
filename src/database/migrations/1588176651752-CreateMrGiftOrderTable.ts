import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMrGiftOrderTable1588176651752 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`mr_gift_orders\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`mr_id\` INT UNSIGNED NOT NULL,
            \`order_count\` INT NOT NULL DEFAULT '0',
            \`pending_orders_count\` INT NOT NULL DEFAULT '0' AFTER \`order_count\`;
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_on\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_mr_mr_id_idx\` (\`mr_id\` ASC),
            CONSTRAINT \`fk_mr_mr_id\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`mr\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('mr_gift_orders');
    }
}
