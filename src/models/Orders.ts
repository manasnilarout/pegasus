import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Chemist } from './Chemist';
import { Item } from './Item';
import { MedicalRepresentative } from './MedicalRepresentative';

@Index('id_UNIQUE', ['orderId'], { unique: true })
@Index('fk_order_mr_id_mr_mr_id_idx', ['mrId'], {})
@Index('fk_order_chemist_id_chemist_chemist_id_idx', ['chemistId'], {})
@Index('fk_order_item_id_item_item_id_idx', ['itemId'], {})
@Entity('orders', { schema: 'pegasus_db' })
export class Orders {
    @PrimaryColumn({ name: 'order_id' })
    public orderId: string;

    @Column({ name: 'mr_id' })
    public mrId: number;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'item_id' })
    public itemId: number;

    @ManyToOne(() => Chemist, chemist => chemist.orders)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'chemistId' }])
    public chemist: Chemist;

    @ManyToOne(() => Item, item => item.orders)
    @JoinColumn([{ name: 'item_id', referencedColumnName: 'itemId' }])
    public item: Item;

    @ManyToOne(() => MedicalRepresentative, medicalRepresentative => medicalRepresentative.orders)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'mrId' }])
    public mr: MedicalRepresentative;
}
