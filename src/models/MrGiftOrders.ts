import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { Mr } from './Mr';

@Entity('mr_gift_orders')
export class MrGiftOrders {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'mr_id' })
    public mrId: number;

    @Column({ name: 'order_count' })
    public orderCount: number;

    @Column({ name: 'pending_orders_count' })
    public pendingOrdersCount: number;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date | null;

    @ManyToOne(() => Mr, mr => mr.mrGiftOrders)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'id' }])
    public mr: Mr;
}
