import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentIdColumnChemistTable1586108828114 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD COLUMN \`attachment_id\` BIGINT UNSIGNED NULL AFTER \`chemist_speciality\`;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('chemist', 'attachment_id');
    }
}
