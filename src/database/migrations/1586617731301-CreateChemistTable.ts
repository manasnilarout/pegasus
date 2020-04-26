import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChemistTable1586617731301 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`chemist\` (
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`user_id\` BIGINT UNSIGNED NOT NULL,
            \`shop_phone\` VARCHAR(20) NOT NULL,
            \`mr_id\` INT UNSIGNED NOT NULL,
            \`doctor_name\` VARCHAR(50) NULL,
            \`speciality\` INT UNSIGNED NULL,
            \`shop_photo\` BIGINT UNSIGNED NOT NULL,
            \`shop_licence\` BIGINT UNSIGNED NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_on\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`, \`user_id\`),
            UNIQUE INDEX \`user_id_UNIQUE\` (\`user_id\` ASC),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_specialty_id_specialty_idx\` (\`speciality\` ASC),
            INDEX \`fk_attachment_shop_photo_id_idx\` (\`shop_photo\` ASC),
            INDEX \`fk_attachment_shop_licence_id_idx\` (\`shop_licence\` ASC),
            CONSTRAINT \`fk_user_user_id_user_id\`
              FOREIGN KEY (\`user_id\`)
              REFERENCES \`user\` (\`user_id\`)
              ON DELETE CASCADE
              ON UPDATE CASCADE,
            CONSTRAINT \`fk_mr_id_mr_id\`
              FOREIGN KEY (\`mr_id\`)
              REFERENCES \`mr\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_specialty_id_specialty\`
              FOREIGN KEY (\`speciality\`)
              REFERENCES \`specialty\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_attachment_shop_photo_id\`
              FOREIGN KEY (\`shop_photo\`)
              REFERENCES \`attachments\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT \`fk_attachment_shop_licence_id\`
              FOREIGN KEY (\`shop_licence\`)
              REFERENCES \`attachments\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('chemist');
    }
}
