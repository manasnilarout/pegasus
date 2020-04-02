import {
    Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn
} from 'typeorm';

import { MedicalRepresentative } from './MedicalRepresentative';

@Index('user_id_UNIQUE', ['mrId'], { unique: true })
@Entity('token', { schema: 'pegasus_db' })
export class Token {
    @PrimaryColumn({ name: 'mr_id' })
    public mrId: number;

    @Column({ name: 'tokens' })
    public tokens: number;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date;

    @OneToOne(() => MedicalRepresentative, medicalRepresentative => medicalRepresentative.token)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'mrId' }])
    public mr: MedicalRepresentative;
}
