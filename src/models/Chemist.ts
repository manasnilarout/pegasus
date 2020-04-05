import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { ChemistMrs } from './ChemistMrs';
import { HeadQuarters } from './HeadQuarters';
import { States } from './States';
import { User } from './User';

@Entity('chemist', { schema: 'pegasus_db' })
export class Chemist {
    @PrimaryGeneratedColumn({ type: 'int', name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'mobile' })
    public mobile: string;

    @Column({ name: 'head_quarter' })
    public headQuarter: number;

    @Column({ name: 'email' })
    public email: string | null;

    @Column({ name: 'shop_phone' })
    public shopPhone: string | null;

    @Column({ name: 'address' })
    public address: string;

    @Column({ name: 'city' })
    public city: string;

    @Column({ name: 'state' })
    public state: number;

    @Column({ name: 'pin' })
    public pin: string;

    @Column({ name: 'doctor_name' })
    public doctorName: string | null;

    @Column({ name: 'chemist_speciality' })
    public chemistSpeciality: number | null;

    @Column({ name: 'status' })
    public status: number;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'created_by' })
    public createdBy: string;

    @ManyToOne(() => User, user => user.chemists)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
    public createdBy2: User;

    @ManyToOne(() => HeadQuarters, headQuarters => headQuarters.chemists)
    @JoinColumn([{ name: 'head_quarter', referencedColumnName: 'id' }])
    public headQuarter2: HeadQuarters;

    @ManyToOne(() => States, states => states.chemists)
    @JoinColumn([{ name: 'state', referencedColumnName: 'id' }])
    public state2: States;

    @OneToMany(() => ChemistMrs, chemistMrs => chemistMrs.chemist)
    public chemistMrs: ChemistMrs[];
}
