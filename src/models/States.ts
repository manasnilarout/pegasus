import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Chemist } from './Chemist';
import { User } from './User';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('states', { schema: 'pegasus_db' })
export class States {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @OneToMany(() => Chemist, chemist => chemist.state2)
    public chemists: Chemist[];

    @OneToMany(() => User, user => user.state)
    public users: User[];
}
