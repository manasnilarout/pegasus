import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Chemist } from './Chemist';
import { QrPoints } from './QrPoints';
import { User } from './User';

@Entity('chemist_qr_point')
export class ChemistQrPoint {
    @PrimaryColumn({ name: 'chemist_id' })
    public chemistId: number;

    @PrimaryColumn({ primary: true, name: 'qr_id', length: 45 })
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
}
