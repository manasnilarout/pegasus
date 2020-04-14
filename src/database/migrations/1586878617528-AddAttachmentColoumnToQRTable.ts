import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentColoumnToQRTable1586878617528 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`qr_points\`
        ADD COLUMN \`attachment_id\` BIGINT UNSIGNED NULL AFTER \`valid_till\`;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('qr_points', 'attachment_id');
    }
}
