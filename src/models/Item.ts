import {
    Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { Orders } from './Orders';

@Index('item_id_UNIQUE', ['itemId'], { unique: true })
@Index('fk_item_chemist_id_chemist_chemist_id_idx', ['chemistId'], {})
@Entity('item', { schema: 'pegasus_db' })
export class Item {
    @PrimaryGeneratedColumn({ name: 'item_id' })
    public itemId: number;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'item_name' })
    public itemName: string;

    @Column({ name: 'price', precision: 2, scale: 0 })
    public price: string;

    @ManyToOne(() => Chemist, chemist => chemist.items)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'chemistId' }])
    public chemist: Chemist;

    @OneToMany(() => Orders, orders => orders.item)
    public orders: Orders[];
}
