import {
    Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn
} from 'typeorm';

import { HeadQuarters } from './HeadQuarters';
import { States } from './States';
import { User } from './User';

export enum CityStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('city')
export class City {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @PrimaryColumn({ name: 'state_id' })
    public stateId: number;

    @PrimaryColumn({ name: 'hq_id' })
    public hqId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'status' })
    public status: CityStatus;

    @OneToMany(() => User, user => user.city)
    public users: User[];

    @ManyToOne(() => HeadQuarters, headQuarters => headQuarters.cities)
    @JoinColumn([{ name: 'hq_id', referencedColumnName: 'id' }])
    public hq: HeadQuarters;

    @ManyToOne(() => States, states => states.cities)
    @JoinColumn([{ name: 'state_id', referencedColumnName: 'id' }])
    public state: States;
}
