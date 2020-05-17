import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { City } from './City';
import { HeadQuarters } from './HeadQuarters';
import { User } from './User';

export enum StateStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('states')
export class States {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'status' })
    public status: StateStatus;

    @OneToMany(() => User, user => user.state)
    public users: User[];

    @OneToMany(() => City, city => city.state)
    public cities: City[];

    @OneToMany(() => HeadQuarters, headQuarters => headQuarters.state)
    public headQuarters: HeadQuarters[];
}
