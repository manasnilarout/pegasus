import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import {
    BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { City } from './City';
import { HeadQuarters } from './HeadQuarters';
import { Mr } from './Mr';
import { Otp } from './Otp';
import { Product } from './Product';
import { QrPoints } from './QrPoints';
import { States } from './States';
import { UserLoginDetails } from './UserLoginDetails';
import { UserTokens } from './UserTokens';

export enum UserType {
    MR = 'mr',
    ADMIN = 'admin',
    CHEMIST = 'chemist',
}

export enum UserStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('user')
export class User {
    public static filterPhoneNumber(phone: string): string {
        return phone.match(/\d/g) ? phone.match(/\d/g).join('') : phone;
    }

    @PrimaryGeneratedColumn({ name: 'user_id' })
    public userId: string;

    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public name: string;

    @IsOptional()
    @IsEmail()
    @Column({ name: 'email' })
    public email: string | null;

    @IsNotEmpty()
    @IsPhoneNumber('IN')
    @Column({ name: 'phone' })
    public phone: string;

    @IsOptional()
    @IsPhoneNumber('IN')
    @Column({ name: 'alt_phone' })
    public altPhone: string;

    @IsEnum(UserType)
    @IsNotEmpty()
    @Column({ name: 'designation', enum: UserType })
    public designation: UserType;

    @Column({ name: 'head_quarter' })
    public headQuarterId: number;

    @Column({ name: 'city' })
    public cityId: number;

    @Column({ name: 'state' })
    public stateId: number;

    @IsNotEmpty()
    @Column({ name: 'address' })
    public address: string;

    @Column({ name: 'status' })
    public status: UserStatus;

    @Column({ name: 'created_by' })
    public createdBy: string | null;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @OneToOne(() => Chemist, chemist => chemist.user)
    public chemist: Chemist;

    @OneToOne(() => Mr, mr => mr.user, { cascade: ['insert', 'update'] })
    public mr: Mr;

    @OneToMany(() => Product, product => product.createdByUser)
    public products: Product[];

    @ManyToOne(() => HeadQuarters, headQuarters => headQuarters.users)
    @JoinColumn([{ name: 'head_quarter', referencedColumnName: 'id' }])
    public headQuarter: HeadQuarters;

    @ManyToOne(() => States, states => states.users)
    @JoinColumn([{ name: 'state', referencedColumnName: 'id' }])
    public state: States;

    @OneToOne(() => UserLoginDetails, userLoginDetails => userLoginDetails.user, { cascade: true })
    public userLoginDetails: UserLoginDetails;

    @OneToMany(() => UserTokens, userTokens => userTokens.user)
    public userTokens: UserTokens[];

    @OneToMany(() => Otp, otp => otp.user, { cascade: true })
    public otps: Otp[];

    @ManyToOne(() => City, city => city.users)
    @JoinColumn([{ name: 'city', referencedColumnName: 'id' }])
    public city: City;

    @OneToMany(() => QrPoints, qrPoints => qrPoints.createdBy)
    public qrPoints: QrPoints[];

    @BeforeInsert()
    public filterPhone(): void {
        this.phone = User.filterPhoneNumber(this.phone);
    }
}
