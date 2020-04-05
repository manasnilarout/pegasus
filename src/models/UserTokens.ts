import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './User';

export enum UserTokenStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('user_tokens')
export class UserTokens {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
    public id: string;

    @Column({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'token' })
    public token: string;

    @Column({ name: 'status' })
    public status: UserTokenStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @ManyToOne(() => User, user => user.userTokens)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;
}
