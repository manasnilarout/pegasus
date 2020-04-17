import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChemistRedemptionTable1587150174072 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chemist_redemptions\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`chemist_id\` INT UNSIGNED NOT NULL,
            \`redeemed_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`initiated_by\` BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_chemist_redemption_chemist_id_idx\` (\`chemist_id\` ASC),
            INDEX \`fk_chemist_redemption_initiated_by_idx\` (\`initiated_by\` ASC),
            CONSTRAINT \`fk_chemist_redemption_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_chemist_redemption_initiated_by\`
              FOREIGN KEY (\`initiated_by\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('chemist_redemptions');
    }
}
