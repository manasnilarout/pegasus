import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpecialtyTable1585762911534 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`specialty\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`name\` VARCHAR(45) NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('specialty');
    }

}
