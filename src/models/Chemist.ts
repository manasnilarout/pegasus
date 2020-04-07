import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { Attachments } from './Attachments';
import { ChemistMrs } from './ChemistMrs';
import { HeadQuarters } from './HeadQuarters';
import { Specialty } from './Specialty';
import { States } from './States';
import { User } from './User';

export enum ChemistStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('chemist')
export class Chemist {
    @PrimaryGeneratedColumn({ type: 'int', name: 'chemist_id' })
    public chemistId: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsNotEmpty()
    @IsPhoneNumber('IN')
    @Column({ name: 'mobile' })
    public mobile: string;

    @Column({ name: 'head_quarter' })
    public headQuarterId: number;

    @IsEmail()
    @IsOptional()
    @Column({ name: 'email' })
    public email: string | null;

    @IsPhoneNumber('IN')
    @IsOptional()
    @Column({ name: 'shop_phone' })
    public shopPhone: string | null;

    @IsNotEmpty()
    @Column({ name: 'address' })
    public address: string;

    @IsNotEmpty()
    @Column({ name: 'city' })
    public city: string;

    @Column({ name: 'state' })
    public stateId: number;

    @IsNotEmpty()
    @Column({ name: 'pin' })
    public pin: string;

    @IsOptional()
    @Column({ name: 'doctor_name' })
    public doctorName: string | null;

    @IsOptional()
    @Column({ name: 'chemist_speciality' })
    public chemistSpecialityId: number | null;

    @Column({ name: 'status' })
    public status: ChemistStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'created_by' })
    public createdById: string;

    @ManyToOne(() => Specialty, specialty => specialty.chemists)
    @JoinColumn([{ name: 'chemist_speciality', referencedColumnName: 'id' }])
    public chemistSpeciality: Specialty;

    @ManyToOne(() => User, user => user.chemists)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
    public createdBy: User;

    @ManyToOne(() => HeadQuarters, headQuarters => headQuarters.chemists)
    @JoinColumn([{ name: 'head_quarter', referencedColumnName: 'id' }])
    public headQuarter: HeadQuarters;

    @ManyToOne(() => States, states => states.chemists)
    @JoinColumn([{ name: 'state', referencedColumnName: 'id' }])
    public state: States;

    @ManyToOne(() => Attachments, attachments => attachments.chemists)
    @JoinColumn([{ name: 'attachment_id', referencedColumnName: 'id' }])
    public attachment: Attachments;

    @OneToMany(() => ChemistMrs, chemistMrs => chemistMrs.chemist, { cascade: true })
    public chemistMrs: ChemistMrs[];

    // Added this for accepting mr id's during API request
    public mrIds: string;
}
