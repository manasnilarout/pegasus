import {
    BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { env } from '../env';
import { getFileName } from '../utils/file.util';
import { Chemist } from './Chemist';
import { QrPoints } from './QrPoints';

export enum AttachmentStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('attachments')
export class Attachments {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'attachment_name' })
    public attachmentName: string;

    @Column({ name: 'file_location' })
    public fileLocation: string;

    @Column({ name: 'file_url' })
    public fileUrl: string;

    @Column({ name: 'status' })
    public status: AttachmentStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @OneToMany(() => Chemist, chemist => chemist.shopLicence)
    public chemistLicence: Chemist[];

    @OneToMany(() => Chemist, chemist => chemist.shopPhoto)
    public chemistPhotos: Chemist[];

    @OneToMany(() => QrPoints, qrPoints => qrPoints.attachment)
    public qrPoints: QrPoints[];

    @BeforeInsert()
    public generateFileUrl(): void {
        const fileName = getFileName(this.fileLocation);
        this.fileUrl = `${env.app.host}:${env.app.port}${env.app.publicRoute}/attachments/${fileName}`;
    }
}
