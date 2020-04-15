import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { HeadQuarters } from './HeadQuarters';
import { QrPoints } from './QrPoints';

export enum HqQrPointStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('hq_qr_points')
export class HqQrPoints {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'qr_points_id' })
    public qrPointId: string;

    @Column({ name: 'hq_id' })
    public hqId: string;

    @Column({ name: 'hq_qr_points' })
    public hqQrPoints: number;

    @Column({ name: 'status' })
    public status: HqQrPointStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date | null;

    @Column({ name: 'created_by' })
    public createdById: string;

    @ManyToOne(() => QrPoints, qrPoints => qrPoints.hqQrPoints)
    @JoinColumn([{ name: 'qr_points_id', referencedColumnName: 'id' }])
    public qrPoint: QrPoints;

    @ManyToOne(() => HeadQuarters, headQuarters => headQuarters.hqQrPoints)
    @JoinColumn([{ name: 'hq_id', referencedColumnName: 'id' }])
    public hq: HeadQuarters;
}
