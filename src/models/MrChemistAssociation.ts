import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Chemist } from './Chemist';
import { MedicalRepresentative } from './MedicalRepresentative';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('fk_mr_chemist_mr_id_mr_mr_id_idx', ['mrId'], {})
@Index('fk_mr_chemist_chemist_id_chemist_chemist_id_idx', ['chemistId'], {})
@Entity('mr_chemist_association', { schema: 'pegasus_db' })
export class MrChemistAssociation {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'mr_id' })
    public mrId: number;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'association_date' })
    public associationDate: Date | null;

    @Column({ name: 'number_of_transactions' })
    public numberOfTransactions: number;

    @Column({ name: 'status' })
    public status: boolean;

    @ManyToOne(() => Chemist, chemist => chemist.mrChemistAssociations)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'chemistId' }])
    public chemist: Chemist;

    @ManyToOne(() => MedicalRepresentative, medicalRepresentative => medicalRepresentative.mrChemistAssociations)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'mrId' }])
    public mr: MedicalRepresentative;
}
