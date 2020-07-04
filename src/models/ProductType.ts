import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product';

export enum ProductTypeStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}
@Entity('product_type')
export class ProductType {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'status' })
    public status: ProductTypeStatus;

    @OneToMany(() => Product, product => product.productType)
    public products: Product[];
}
