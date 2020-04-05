import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentForeignKeyChemistTable1586108828115 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
            ADD CONSTRAINT \`fk_chemist_attachments_id\`
            FOREIGN KEY (\`attachment_id\`)
            REFERENCES \`attachments\` (\`id\`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_attachments_id');
    }
}
