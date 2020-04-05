import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('pack_type')
export class PackType {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @OneToMany(() => Product, product => product.packType)
    public products: Product[];
}
