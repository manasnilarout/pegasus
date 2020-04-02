import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

import { Claim } from './Claim';
import { Item } from './Item';
import { MrChemistAssociation } from './MrChemistAssociation';
import { Orders } from './Orders';
import { User } from './User';

@Index('chemist_id_UNIQUE', ['chemistId'], { unique: true })
@Index('fk_chemist_user_id_user_user_id_idx', ['userId'], {})
@Entity('chemist', { schema: 'pegasus_db' })
export class Chemist {
    @PrimaryGeneratedColumn({ type: 'int', name: 'chemist_id', unsigned: true })
    public chemistId: number;

    @Column({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'chemist_shop_name' })
    public chemistShopName: string;

    @Column({ name: 'chemist_shop_phone_1' })
    public chemistShopPhone_1: string;

    @Column({ name: 'chemist_shop_phone_2' })
    public chemistShopPhone_2: string | null;

    @Column({ name: 'address_1', length: 50 })
    public address_1: string;

    @Column({ name: 'address_2', nullable: true, length: 50 })
    public address_2: string | null;

    @Column({ name: 'city', length: 20 })
    public city: string;

    @Column({ name: 'state', length: 20 })
    public state: string;

    @Column({ name: 'country', length: 20 })
    public country: string;

    @Column({ name: 'pin', length: 10 })
    public pin: string;

    @Column({ name: 'status' })
    public status: boolean;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'created_by', nullable: true })
    public createdBy: string | null;

    @OneToMany(() => Claim, claim => claim.chemist)
    public claims: Claim[];

    @OneToMany(() => Item, item => item.chemist)
    public items: Item[];

    @OneToMany(() => MrChemistAssociation, mrChemistAssociation => mrChemistAssociation.chemist)
    public mrChemistAssociations: MrChemistAssociation[];

    @OneToMany(() => Orders, orders => orders.chemist)
    public orders: Orders[];

    @ManyToOne(() => User, user => user.chemists)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;
}
