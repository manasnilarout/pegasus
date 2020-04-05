import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Chemist } from './Chemist';
import { User } from './User';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('head_quarters')
export class HeadQuarters {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column('varchar', { name: 'name' })
    public name: string;

    @OneToMany(() => Chemist, chemist => chemist.headQuarter)
    public chemists: Chemist[];

    @OneToMany(() => User, user => user.headQuarter)
    public users: User[];
}
