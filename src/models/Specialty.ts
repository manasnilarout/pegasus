import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('specialty', { schema: 'pegasus_db' })
export class Specialty {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column('varchar', { name: 'name' })
    public name: string;
}
