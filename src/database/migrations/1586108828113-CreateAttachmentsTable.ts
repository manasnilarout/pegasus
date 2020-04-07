import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAttachmentsTable1586108828113 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`attachments\` (
            \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`attachment_name\` VARCHAR(50) NOT NULL,
            \`file_location\` VARCHAR(200) NOT NULL,
            \`file_url\` VARCHAR(150) NOT NULL,
            \`status\` TINYINT NOT NULL DEFAULT 1,
            \`created_on\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`),
            UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC))
          ENGINE = InnoDB
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('attachments');
    }
}
