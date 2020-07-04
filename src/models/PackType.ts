import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product';

export enum PackTypeStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}
@Entity('pack_type')
export class PackType {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'status' })
    public status: PackTypeStatus;

    @OneToMany(() => Product, product => product.packType)
    public products: Product[];
}
