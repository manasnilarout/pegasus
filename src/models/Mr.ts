import {
    Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { User } from './User';

@Entity('mr')
export class Mr {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    public id: number;

    @PrimaryColumn({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'status' })
    public status: number;

    @Column({ name: 'created_on' })
    public createdOn: Date;

    @OneToMany(() => Chemist, chemist => chemist.mr)
    public chemists: Chemist[];

    @OneToOne(() => User, user => user.mr)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;
}
