import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStatesTable1585762911527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`states\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`name\` VARCHAR(50) NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT '1',
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('states');
    }

}
