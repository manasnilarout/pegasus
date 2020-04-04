import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTypeTable1585762911531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`product_type\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`name\` VARCHAR(45) NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            UNIQUE INDEX \`name_UNIQUE\` (\`name\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('product_type');
    }

}
