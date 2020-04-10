import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { User } from './User';

export enum OTPStatus {
    EXPIRED = 0,
    ACTIVE = 1,
    USED = 2,
}

export enum OTPReason {
    PASSWORD_RESET = 'password-reset',
    REDEEM_POINTS = 'redeem-points',
}

@Entity('otp')
export class Otp {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'otp' })
    public otp: string;

    @Column({ name: 'status' })
    public status: number;

    @Column({ name: 'reason', enum: OTPReason })
    public reason: OTPReason;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date;

    @ManyToOne(() => User, user => user.otps)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;
}
