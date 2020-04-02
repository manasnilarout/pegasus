import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { MedicalRepresentative } from './MedicalRepresentative';

export enum UserStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Index('user_id_UNIQUE', ['userId'], { unique: true })
@Entity('user', { schema: 'pegasus_db' })
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    public userId: string;

    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string | null;

    @IsNotEmpty()
    @Column({ name: 'username' })
    public username: string;

    @IsNotEmpty()
    @Column({ name: 'password', length: 100 })
    public password: string;

    @IsNotEmpty()
    @IsPhoneNumber('IN')
    @Column({ name: 'phone', length: 20 })
    public phone: string;

    @IsPhoneNumber('IN')
    @IsOptional()
    @Column({ name: 'secondary_phone', length: 20 })
    public secondaryPhone: string | null;

    @IsNotEmpty()
    @IsEmail()
    @Column({ name: 'email', length: 75 })
    public email: string | null;

    @IsNotEmpty()
    @Column({ name: 'address_1', length: 100 })
    public address_1: string;

    @Column({ name: 'address_2', length: 100 })
    public address_2: string | null;

    @IsNotEmpty()
    @Column({ name: 'city', length: 15 })
    public city: string;

    @IsNotEmpty()
    @Column({ name: 'state', length: 15 })
    public state: string;

    @IsNotEmpty()
    @Column({ name: 'country', length: 15, default: () => "'India'" })
    public country: string;

    @IsNotEmpty()
    @Column({ name: 'pin', length: 10 })
    public pin: string;

    @Column({ name: 'status' })
    public status: UserStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'created_by' })
    public createdBy: string | null;

    @OneToMany(() => Chemist, chemist => chemist.user, { cascade: true })
    public chemists: Chemist[];

    @OneToMany(() => MedicalRepresentative, medicalRepresentative => medicalRepresentative.user, {
        cascade: true,
    })
    public medicalRepresentatives: MedicalRepresentative[];
}
