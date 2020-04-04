import { compare, hash as hashPassword } from 'bcrypt';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from './User';

@Entity('user_login_details')
export class UserLoginDetails {
    public static encryptUserPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            hashPassword(password, 4, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(userPassword: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            compare(password, userPassword, (err, res) => {
                return resolve(res === true);
            });
        });
    }

    @PrimaryColumn({ name: 'user_id' })
    public userId: string;

    @Column({ name: 'username' })
    public username: string;

    @Column({ name: 'password' })
    public password: string;

    @OneToOne(() => User, user => user.userLoginDetails)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
    public user: User;

    @BeforeInsert()
    public async setPassword(): Promise<void> {
        console.log('BEFORE INSERT');
        this.password = await UserLoginDetails.encryptUserPassword(this.password);
        console.log(this.password);
    }
}
