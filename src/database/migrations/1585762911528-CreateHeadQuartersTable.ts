import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHeadQuartersTable1585762911528 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`head_quarters\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`name\` VARCHAR(50) NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('head_quarters');
    }

}
