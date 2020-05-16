import {
    Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { City } from './City';
import { HqQrPoints } from './HqQrPoints';
import { States } from './States';
import { User } from './User';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('head_quarters')
export class HeadQuarters {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'state_id' })
    public stateId: string;

    @OneToMany(() => User, user => user.headQuarter)
    public users: User[];

    @OneToMany(() => HqQrPoints, hqQrPoints => hqQrPoints.hq)
    public hqQrPoints: HqQrPoints[];

    @ManyToOne(() => States, states => states.headQuarters)
    @JoinColumn([{ name: 'state_id', referencedColumnName: 'id' }])
    public state: States;

    @OneToMany(() => City, city => city.hq)
    public cities: City[];
}
