import {
    Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn
} from 'typeorm';

import { config } from '../config';
import { Chemist } from './Chemist';
import { MrGiftOrders } from './MrGiftOrders';
import { User } from './User';

export enum MRStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('mr')
export class Mr {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    public id: number;

    @PrimaryColumn({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'status' })
    public status: MRStatus;

    @Column({ name: 'created_on' })
    public createdOn: Date;

    @OneToMany(() => Chemist, chemist => chemist.mr)
    public chemists: Chemist[];

    @OneToOne(() => User, user => user.mr)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;

    @OneToMany(() => MrGiftOrders, mrGiftOrders => mrGiftOrders.mr, { cascade: true })
    public mrGiftOrders: MrGiftOrders[];
}
