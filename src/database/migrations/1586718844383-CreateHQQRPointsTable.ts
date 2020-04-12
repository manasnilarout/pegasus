import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHQQRPointsTable1586718844383 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`hq_qr_points\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`qr_points_id\` VARCHAR(45) NOT NULL,
            \`hq_qr_points\` INT NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updated_on\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            \`created_by\` BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
            INDEX \`fk_hq_qr_qr_qr_id_idx\` (\`qr_points_id\` ASC),
            CONSTRAINT \`fk_hq_qr_qr_qr_id\`
              FOREIGN KEY (\`qr_points_id\`)
              REFERENCES \`qr_points\` (\`id\`)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('hq_qr_points');
    }
}
