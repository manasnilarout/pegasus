import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKey3InChemist1585762911535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`chemist\`
        ADD CONSTRAINT \`fk_chemist_created_by_user_user_id\`
        FOREIGN KEY (\`created_by\`)
        REFERENCES \`user\` (\`user_id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('chemist', 'fk_chemist_created_by_user_user_id');
    }

}
