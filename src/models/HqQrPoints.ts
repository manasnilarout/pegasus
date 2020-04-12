import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { QrPoints } from './QrPoints';

@Entity('hq_qr_points', { schema: 'pegasus_db' })
export class HqQrPoints {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'qr_points_id' })
    public qrPointsId: string;

    @Column({ name: 'hq_qr_points' })
    public hqQrPoints: number;

    @Column({ name: 'status' })
    public status: number;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date | null;

    @Column({ name: 'created_by' })
    public createdById: string;

    @ManyToOne(() => QrPoints, qrPoints => qrPoints.hqQrPoints)
    @JoinColumn([{ name: 'qr_points_id', referencedColumnName: 'id' }])
    public qrPoints: QrPoints;
}
