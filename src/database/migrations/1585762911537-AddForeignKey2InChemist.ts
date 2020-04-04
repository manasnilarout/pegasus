import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKey2InChemist1585762911535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD CONSTRAINT \`fk_chemist_head_quarter_head_quarter_id\`
        FOREIGN KEY (\`head_quarter\`)
        REFERENCES \`head_quarters\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_head_quarter_head_quarter_id');
    }

}
