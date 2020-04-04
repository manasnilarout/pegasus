import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Chemist } from './Chemist';
import { User } from './User';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('head_quarters', { schema: 'pegasus_db' })
export class HeadQuarters {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column('varchar', { name: 'name' })
    public name: string;

    @OneToMany(() => Chemist, chemist => chemist.headQuarter2)
    public chemists: Chemist[];

    @OneToMany(() => User, user => user.headQuarter2)
    public users: User[];
}
