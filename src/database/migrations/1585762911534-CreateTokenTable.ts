import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenTable1585762911534 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`token\` (
            \`mr_id\` INT UNSIGNED NOT NULL,
            \`tokens\` INT NOT NULL DEFAULT 0,
            \`updated_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`mr_id\`),
            UNIQUE INDEX \`user_id_UNIQUE\` (\`mr_id\` ASC),
            CONSTRAINT \`fk_token_user_id_user_user_id\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`medical_representative\` (\`mr_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('token');
    }

}
