import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { MedicalRepresentative } from './MedicalRepresentative';

@Index('user_id_UNIQUE', ['userId'], { unique: true })
@Entity('user', { schema: 'pegasus_db' })
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string | null;

    @Column({ name: 'username' })
    public username: string;

    @Column({ name: 'password', length: 100 })
    public password: string;

    @Column({ name: 'phone', length: 20 })
    public phone: string;

    @Column({ name: 'secondary_phone', length: 20 })
    public secondaryPhone: string | null;

    @Column({ name: 'email', length: 75 })
    public email: string | null;

    @Column({ name: 'address_1', length: 100 })
    public address_1: string;

    @Column({ name: 'address_2', length: 100 })
    public address_2: string | null;

    @Column({ name: 'city', length: 15 })
    public city: string;

    @Column({ name: 'state', length: 15 })
    public state: string;

    @Column({ name: 'country', length: 15, default: () => "'India'" })
    public country: string;

    @Column({ name: 'pin', length: 10 })
    public pin: string;

    @Column({ name: 'status' })
    public status: boolean;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'created_by' })
    public createdBy: string | null;

    @OneToOne(() => Chemist, chemist => chemist.user)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: Chemist;

    @OneToOne(() => MedicalRepresentative, medicalRepresentative => medicalRepresentative.user)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user2: MedicalRepresentative;
}
