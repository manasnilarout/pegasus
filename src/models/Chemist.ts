import { IsNotEmpty, IsOptional } from 'class-validator';
import {
    BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Attachments } from './Attachments';
import { ChemistQrPoint } from './ChemistQrPoint';
import { ChemistRedemptions } from './ChemistRedemptions';
import { Mr } from './Mr';
import { Specialty } from './Specialty';
import { User } from './User';

export enum ChemistStatus {
    ACTIVE = 1,
    INACTIVE = 0,
}

@Entity('chemist')
export class Chemist {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @PrimaryColumn({ name: 'user_id' })
    public userId: string;

    @IsNotEmpty()
    @Column({ name: 'shop_phone' })
    public shopPhone: string;

    @IsOptional()
    @Column({ name: 'mr_id' })
    public mrId: number;

    @IsOptional()
    @Column({ name: 'doctor_name' })
    public doctorName: string | null;

    @IsOptional()
    @Column({ name: 'speciality' })
    public speciality: number | null;

    @Column({ name: 'shop_photo' })
    public shopPhotoId: string;

    @Column({ name: 'shop_licence' })
    public shopLicenceId: string;

    @IsNotEmpty()
    @Column({ name: 'status' })
    public status: ChemistStatus;

    @CreateDateColumn({ name: 'created_on' })
    public createdOn: Date;

    @UpdateDateColumn({ name: 'updated_on' })
    public updatedOn: Date | null;

    @ManyToOne(() => Attachments, attachments => attachments.chemistLicence)
    @JoinColumn([{ name: 'shop_licence', referencedColumnName: 'id' }])
    public shopLicence: Attachments;

    @ManyToOne(() => Attachments, attachments => attachments.chemistPhotos)
    @JoinColumn([{ name: 'shop_photo', referencedColumnName: 'id' }])
    public shopPhoto: Attachments;

    @ManyToOne(() => Mr, mr => mr.chemists)
    @JoinColumn([{ name: 'mr_id', referencedColumnName: 'id' }])
    public mr: Mr;

    @ManyToOne(() => Specialty, specialty => specialty.chemists)
    @JoinColumn([{ name: 'speciality', referencedColumnName: 'id' }])
    public chemistSpeciality: Specialty;

    @OneToOne(() => User, user => user.chemist)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;

    @OneToMany(() => ChemistQrPoint, chemistQrPoint => chemistQrPoint.chemist)
    public chemistQrPoints: ChemistQrPoint[];

    @OneToMany(() => ChemistRedemptions, chemistRedemptions => chemistRedemptions.chemist)
    public chemistRedemptions: ChemistRedemptions[];

    @BeforeInsert()
    public filterPhone(): void {
        this.shopPhone = User.filterPhoneNumber(this.shopPhone);
    }
}
