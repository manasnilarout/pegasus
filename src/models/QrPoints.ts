import { Type } from 'class-transformer';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';

import { HqQrPoints } from './HqQrPoints';
import { Product } from './Product';
import { User } from './User';

@Entity('qr_points')
export class QrPoints {
    @PrimaryColumn({ name: 'id' })
    public id: string;

    @PrimaryColumn({ name: 'batch_number' })
    public batchNumber: string;

    @PrimaryColumn({ name: 'batch_quantity' })
    public batchQuantity: number;

    @Column({ name: 'product_id' })
    public productId: string;

    @Column({ name: 'points' })
    public points: number;

    @Column({ name: 'valid_from' })
    @Type(() => Date)
    public validFrom: Date;

    @Column({ name: 'valid_till' })
    @Type(() => Date)
    public validTill: Date;

    @Column({ name: 'status' })
    public status: number;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date | null;

    @Column({ name: 'created_by' })
    public createdById: string;

    @OneToMany(() => HqQrPoints, hqQrPoints => hqQrPoints.qrPoints)
    public hqQrPoints: HqQrPoints[];

    @ManyToOne(() => User, user => user.qrPoints)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
    public createdBy: User;

    @ManyToOne(() => Product, product => product.qrPoints)
    @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
    public product: Product;
}
