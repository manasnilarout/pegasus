import { IsNotEmpty, IsOptional } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { PackType } from './PackType';
import { ProductType } from './ProductType';
import { QrPoints } from './QrPoints';
import { User } from './User';

export enum ProductStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsOptional()
    @Column({ name: 'brand' })
    public brand: string | null;

    @IsNotEmpty()
    @Column({ name: 'product_name' })
    public productName: string;

    @IsNotEmpty()
    @Column({ name: 'active_ingredients' })
    public activeIngredients: string | null;

    @Column({ name: 'product_type' })
    public productTypeId: number;

    @Column({ name: 'pack_type' })
    public packTypeId: number;

    @Column({ name: 'points' })
    public points: number;

    @IsNotEmpty()
    @Column({ name: 'pack_size' })
    public packSize: string;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'status' })
    public status: ProductStatus;

    @Column({ name: 'created_by' })
    public createdBy: string;

    @ManyToOne(() => User, user => user.products)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
    public createdByUser: User;

    @ManyToOne(() => PackType, packTypeModel => packTypeModel.products)
    @JoinColumn([{ name: 'pack_type', referencedColumnName: 'id' }])
    public packType: PackType;

    @ManyToOne(() => ProductType, productType => productType.products)
    @JoinColumn([{ name: 'product_type', referencedColumnName: 'id' }])
    public productType: ProductType;

    @OneToMany(() => QrPoints, qrPoints => qrPoints.product)
    public qrPoints: QrPoints[];
}
