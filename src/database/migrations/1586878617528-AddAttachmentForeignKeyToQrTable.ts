import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentForeignKeyToQrTable1586878617528 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`qr_points\`
        ADD CONSTRAINT \`fk_qr_attachment_attachment_id\`
        FOREIGN KEY (\`attachment_id\`)
        REFERENCES \`attachments\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('qr_points', 'fk_qr_attachment_attachment_id');
    }
}
