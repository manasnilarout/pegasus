import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { MedicalRepresentative } from './MedicalRepresentative';

@Index('claim_id_UNIQUE', ['claimId'], { unique: true })
@Index('fk_claims_mr_id_mr_m_mr_idr_idx', ['mrId'], {})
@Index('fk_claims_chemist_id_chemist_chemist_id_idx', ['chemistId'], {})
@Entity('claim', { schema: 'pegasus_db' })
export class Claim {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'claim_id' })
    public claimId: string;

    @Column({ name: 'mr_id' })
    public mrId: number;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'no_of_tokens' })
    public noOfTokens: number;

    @Column({ name: 'value_in_rs', precision: 2 })
    public valueInRs: string;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @ManyToOne(() => Chemist, chemist => chemist.claims)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'chemistId' }])
    public chemist: Chemist;

    @ManyToOne(() => MedicalRepresentative, medicalRepresentative => medicalRepresentative.claims)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'mrId' }])
    public mr: MedicalRepresentative;
}
