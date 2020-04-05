import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialtyForeignKeyChemistTable1586108828116 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD CONSTRAINT \`fk_chemist_specialty_id\`
        FOREIGN KEY (\`chemist_speciality\`)
        REFERENCES \`specialty\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_specialty_id');
    }
}
