import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyInChemist1585762911535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD CONSTRAINT \`fk_chemist_state_state_id\`
        FOREIGN KEY (\`state\`)
        REFERENCES \`states\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_state_state_id');
    }

}
