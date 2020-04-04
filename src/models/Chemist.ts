import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { HeadQuarters } from './HeadQuarters';
import { States } from './States';
import { User } from './User';

@Index('chemist_id_UNIQUE', ['chemistId'], { unique: true })
@Index('fk_chemist_speciality_speciality_id_idx', ['chemistSpeciality'], {})
@Index('fk_chemist_state_state_id', ['state'], {})
@Index('fk_chemist_head_quarter_head_quarter_id', ['headQuarter'], {})
@Index('fk_chemist_created_by_user_user_id', ['createdBy'], {})
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

    @Column({ name: 'mr' })
    public mr: string | null;

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
}
