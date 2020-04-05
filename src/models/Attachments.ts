import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Chemist } from './Chemist';

@Entity('attachments')
export class Attachments {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'attachment_name' })
    public attachmentName: string;

    @Column({ name: 'file_location' })
    public fileLocation: string;

    @Column({ name: 'status' })
    public status: number;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @OneToMany(() => Chemist, chemist => chemist.attachment)
    public chemists: Chemist[];
}
