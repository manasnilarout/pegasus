import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import {
    AfterLoad, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';

import { Attachments } from './Attachments';
import { ChemistQrPoint } from './ChemistQrPoint';
import { HqQrPoints, HqQrPointStatus } from './HqQrPoints';
import { Product } from './Product';
import { User } from './User';

export enum QrPointsStatus {
    USED = 0,
    ACTIVE = 1,
    ALLOTTED = 2,
    EXPIRED = 3,
}

@Entity('qr_points')
export class QrPoints {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'id' })
    public id: string;

    @IsNotEmpty()
    @PrimaryColumn({ name: 'batch_number' })
    public batchNumber: string;

    @IsNotEmpty()
    @PrimaryColumn({ name: 'batch_quantity' })
    public batchQuantity: number;

    @Column({ name: 'product_id' })
    public productId: string;

    @IsNotEmpty()
    @Column({ name: 'points' })
    public points: number;

    @IsNotEmpty()
    @IsDate()
    @Column({ name: 'valid_from' })
    @Type(() => Date)
    public validFrom: Date;

    @IsNotEmpty()
    @IsDate()
    @Column({ name: 'valid_till' })
    @Type(() => Date)
    public validTill: Date;

    @Column({ name: 'status' })
    public status: QrPointsStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date | null;

    @Column({ name: 'created_by' })
    public createdById: string;

    @OneToMany(() => HqQrPoints, hqQrPoints => hqQrPoints.qrPoint)
    public hqQrPoints: HqQrPoints[];

    @ManyToOne(() => User, user => user.qrPoints)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
    public createdBy: User;

    @ManyToOne(() => Product, product => product.qrPoints)
    @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
    public product: Product;

    @ManyToOne(() => Attachments, attachments => attachments.qrPoints)
    @JoinColumn([{ name: 'attachment_id', referencedColumnName: 'id' }])
    public attachment: Attachments;

    @OneToMany(() => ChemistQrPoint, chemistQrPoint => chemistQrPoint.qr)
    public chemistQrPoints: ChemistQrPoint[];

    @AfterLoad()
    public updatePoints(): void {
        if (!this.hqQrPoints || !this.hqQrPoints.length) {
            return;
        }

        const activeHqQr = this.hqQrPoints.find(hqQr => hqQr.status === HqQrPointStatus.ACTIVE);
        this.points = activeHqQr ? activeHqQr.hqQrPoints : this.points;
    }
}
