import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('migrations', { schema: 'pegasus_db' })
export class Migrations {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'timestamp' })
    public timestamp: string;

    @Column({ name: 'name' })
    public name: string;
}
