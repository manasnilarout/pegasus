import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Chemist } from './Chemist';

@Entity('specialty')
export class Specialty {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @OneToMany(() => Chemist, chemist => chemist.chemistSpeciality)
    public chemists: Chemist[];
}
