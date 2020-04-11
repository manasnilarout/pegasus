import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

@Entity('city', { schema: 'pegasus_db' })
export class City {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name', length: 50 })
    public name: string;

    @OneToMany(() => User, user => user.city)
    public users: User[];
}
