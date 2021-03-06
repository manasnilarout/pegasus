import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { ChemistRedemptions } from './ChemistRedemptions';
import { QrPoints } from './QrPoints';
import { User } from './User';

@Entity('chemist_qr_point')
export class ChemistQrPoint {
    @PrimaryGeneratedColumn({  name: 'id' })
    public id: number;

    @PrimaryColumn({ name: 'chemist_id' })
    public chemistId: number;

    @PrimaryColumn({ name: 'qr_id' })
    public qrId: string;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'created_by' })
    public createdById: string;

    @ManyToOne(() => Chemist, chemist => chemist.chemistQrPoints)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'id' }])
    public chemist: Chemist;

    @ManyToOne(() => QrPoints, qrPoints => qrPoints.chemistQrPoints)
    @JoinColumn([{ name: 'qr_id', referencedColumnName: 'id' }])
    public qr: QrPoints;

    @ManyToOne(() => User, user => user.chemistQrPoints)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
    public createdBy: User;

    @OneToMany(() => ChemistRedemptions, chemistRedemptions => chemistRedemptions.chemistQr)
    public chemistRedemptions: ChemistRedemptions[];
}
