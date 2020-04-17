import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { User } from './User';

@Entity('chemist_redemptions')
export class ChemistRedemptions {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @CreateDateColumn({ name: 'redeemed_on' })
    public redeemedOn: Date;

    @Column({ name: 'initiated_by' })
    public initiatedById: string;

    @ManyToOne(() => Chemist, chemist => chemist.chemistRedemptions)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'id' }])
    public chemist: Chemist;

    @ManyToOne(() => User, user => user.chemistRedemptions)
    @JoinColumn([{ name: 'initiated_by', referencedColumnName: 'userId' }])
    public initiatedBy: User;
}
