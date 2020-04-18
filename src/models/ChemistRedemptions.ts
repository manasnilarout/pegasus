import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { ChemistQrPoint } from './ChemistQrPoint';
import { User } from './User';

@Entity('chemist_redemptions')
export class ChemistRedemptions {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'chemist_qr_point_id' })
    public chemistQrPointId: number;

    @Column({ name: 'points' })
    public points: number;

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

    @ManyToOne(() => ChemistQrPoint, chemistQrPoint => chemistQrPoint.chemistRedemptions)
    @JoinColumn([{ name: 'chemist_qr_point_id', referencedColumnName: 'id' }])
    public chemistQr: ChemistQrPoint;
}
