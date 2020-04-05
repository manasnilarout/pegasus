import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('name_UNIQUE', ['name'], { unique: true })
@Entity('product_type')
export class ProductType {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column('varchar', { name: 'name' })
    public name: string;

    @OneToMany(() => Product, product => product.productType)
    public products: Product[];
}
