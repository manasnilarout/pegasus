import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMRChemistTable1585762911532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`mr_chemist_association\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`mr_id\` INT UNSIGNED NOT NULL,
            \`chemist_id\` INT UNSIGNED NOT NULL,
            \`association_date\` DATETIME NULL,
            \`number_of_transactions\` INT NOT NULL DEFAULT 0,
            \`status\` TINYINT(1) NOT NULL DEFAULT 1,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_mr_chemist_mr_id_mr_mr_id_idx\` (\`mr_id\` ASC),
            INDEX \`fk_mr_chemist_chemist_id_chemist_chemist_id_idx\` (\`chemist_id\` ASC),
            CONSTRAINT \`fk_mr_chemist_mr_id_mr_mr_id\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`medical_representative\` (\`mr_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_mr_chemist_chemist_id_chemist_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`chemist_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('mr_chemist_association');
    }

}
