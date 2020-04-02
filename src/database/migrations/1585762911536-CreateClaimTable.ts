import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClaimTable1585762911536 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`claim\` (
            \`claim_id\` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            \`mr_id\` INT UNSIGNED NOT NULL,
            \`chemist_id\` INT UNSIGNED NOT NULL,
            \`no_of_tokens\` INT NOT NULL DEFAULT 0,
            \`value_in_rs\` DECIMAL(2) NOT NULL DEFAULT 0,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`claim_id\`),
            UNIQUE INDEX \`claim_id_UNIQUE\` (\`claim_id\` ASC),
            INDEX \`fk_claims_mr_id_mr_m_mr_idr_idx\` (\`mr_id\` ASC),
            INDEX \`fk_claims_chemist_id_chemist_chemist_id_idx\` (\`chemist_id\` ASC),
            CONSTRAINT \`fk_claims_mr_id_mr_m_mr_idr\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`medical_representative\` (\`mr_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_claims_chemist_id_chemist_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`chemist_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('claim');
    }

}
