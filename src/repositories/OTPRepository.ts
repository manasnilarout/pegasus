import { customAlphabet } from 'nanoid';
import { EntityRepository, Repository } from 'typeorm';

import { config } from '../config';
import { Otp, OTPReason, OTPStatus } from '../models/Otp';

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp>  {
    protected randomOtp: () => string;

    constructor() {
        super();
        this.randomOtp = customAlphabet(config.get('otp.otpCharacters'), config.get('otp.otpSize'));
    }

    public async generateOtp(userId: string, reason: OTPReason): Promise<Otp> {
        const otp = new Otp();
        otp.otp = this.randomOtp();
        otp.status = OTPStatus.ACTIVE;
        otp.reason = reason;
        otp.userId = userId;
        return this.save(otp);
    }

    public async getOtp(otp: string, chemistId: string): Promise<Otp> {
        return await this.createQueryBuilder('otp')
            .leftJoinAndSelect('otp.user', 'user')
            .leftJoinAndSelect('user.chemist', 'chemist')
            .where('otp.otp = :otp', { otp })
            .andWhere('otp.status = :status', { status: OTPStatus.ACTIVE })
            .andWhere('otp.reason = :reason', { reason: OTPReason.REDEEM_POINTS })
            .andWhere('chemist.id = :id', { id: chemistId })
            .getOne();
    }
}
