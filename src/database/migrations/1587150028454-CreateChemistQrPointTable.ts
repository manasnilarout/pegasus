import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChemistQrPointTable1587150028454 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chemist_qr_point\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`chemist_id\` INT UNSIGNED NOT NULL,
            \`qr_id\` VARCHAR(45) NOT NULL,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY (\`id\`, \`chemist_id\`, \`qr_id\`),
            INDEX \`fk_chemist_qr_qr_id_idx\` (\`qr_id\` ASC),
            INDEX \`fk_chemist_qr_user_id_idx\` (\`created_by\` ASC),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            CONSTRAINT \`fk_chemist_qr_chemist_id\`
              FOREIGN KEY (\`chemist_id\`)
              REFERENCES \`chemist\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_chemist_qr_qr_id\`
              FOREIGN KEY (\`qr_id\`)
              REFERENCES \`qr_points\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_chemist_qr_user_id\`
              FOREIGN KEY (\`created_by\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('chemist_qr_point');
    }
}
