import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { Claim } from './Claim';
import { MrChemistAssociation } from './MrChemistAssociation';
import { Orders } from './Orders';
import { Token } from './Token';
import { User } from './User';

export enum MRStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Index('mr_id_UNIQUE', ['mrId'], { unique: true })
@Index('fk_mr_mr_id_user_user_id_idx', ['userId'], {})
@Entity('medical_representative', { schema: 'pegasus_db' })
export class MedicalRepresentative {
    @PrimaryGeneratedColumn({ name: 'mr_id' })
    public mrId: number;

    @Column({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'total_claims' })
    public totalClaims: number | null;

    @Column({ name: 'total_order_amount' })
    public totalOrderAmount: number | null;

    @Column({ name: 'status' })
    public status: MRStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @OneToMany(() => Claim, claim => claim.mr)
    public claims: Claim[];

    @OneToMany(() => MrChemistAssociation, mrChemistAssociation => mrChemistAssociation.mr)
    public mrChemistAssociations: MrChemistAssociation[];

    @OneToMany(() => Orders, orders => orders.mr)
    public orders: Orders[];

    @OneToOne(() => Token, token => token.mr)
    public token: Token;

    @ManyToOne(() => User, user => user.medicalRepresentatives)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;
}
