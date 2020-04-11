import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCityForeignKeyToUser1586617731304 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`user\`
        ADD CONSTRAINT \`fk_city_city_id\`
            FOREIGN KEY (\`city\`)
            REFERENCES \`city\` (\`id\`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('user', 'fk_city_city_id');
    }
}
