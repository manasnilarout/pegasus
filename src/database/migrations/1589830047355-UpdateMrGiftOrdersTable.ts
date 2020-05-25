import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateMrGiftOrdersTable1589830047355 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE \`mr_gift_orders\`
        ADD COLUMN \`dispatched_gifts\` INT NOT NULL DEFAULT '0' AFTER \`received_gifts\`,
        CHANGE COLUMN \`order_count\` \`required_gifts\` INT NOT NULL DEFAULT '0' ,
        CHANGE COLUMN \`pending_orders_count\` \`received_gifts\` INT NOT NULL DEFAULT '0' ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns('city', [
            new TableColumn({ name: 'dispatched_gifts', type: 'int' }),
            new TableColumn({ name: 'order_count', type: 'int' }),
            new TableColumn({ name: 'received_gifts', type: 'tinyint' }),
        ]);
    }
}
