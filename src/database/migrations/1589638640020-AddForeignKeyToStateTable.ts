import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyToStateTable1589638640020 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`head_quarters\`
        ADD CONSTRAINT \`fk_hq_state_id\`
        FOREIGN KEY (\`state_id\`)
        REFERENCES \`states\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('head_quarters', 'fk_hq_state_id');
    }
}
