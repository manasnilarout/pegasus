import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHqForeignKeyToHqQrTable1586974126919 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`hq_qr_points\`
            ADD CONSTRAINT \`fk_hq_qr_hq_id\`
            FOREIGN KEY (\`hq_id\`)
            REFERENCES \`head_quarters\` (\`id\`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('hq_qr_points', 'fk_hq_qr_hq_id');
    }
}
