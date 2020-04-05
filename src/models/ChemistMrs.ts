import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Chemist } from './Chemist';
import { User } from './User';

@Entity('chemist_mrs', { schema: 'pegasus_db' })
export class ChemistMrs {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'chemist_id' })
    public chemistId: number;

    @Column({ name: 'mr_id' })
    public mrId: string;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @Column({ name: 'status' })
    public status: number;

    @ManyToOne(() => Chemist, chemist => chemist.chemistMrs)
    @JoinColumn([{ name: 'chemist_id', referencedColumnName: 'chemistId' }])
    public chemist: Chemist;

    @ManyToOne(() => User, user => user.chemistMrs)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'userId' }])
    public mr: User;
}
