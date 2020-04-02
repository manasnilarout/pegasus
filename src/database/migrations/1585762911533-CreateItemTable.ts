import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemTable1585762911533 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`item\` (
            \`item_id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`chemist_id\` INT UNSIGNED NOT NULL,
            \`item_name\` VARCHAR(50) NOT NULL,
            \`price\` DECIMAL(2) NOT NULL,
            PRIMARY KEY (\`item_id\`),
            UNIQUE INDEX \`item_id_UNIQUE\` (\`item_id\` ASC),
            INDEX \`fk_item_chemist_id_chemist_chemist_id_idx\` (\`chemist_id\` ASC),
            CONSTRAINT \`fk_item_chemist_id_chemist_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`chemist_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('item');
    }

}
