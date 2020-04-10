import { customAlphabet } from 'nanoid';
import { EntityRepository, Repository } from 'typeorm';

import { Otp, OTPReason, OTPStatus } from '../models/Otp';

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp>  {
    protected randomOtp: () => string;

    constructor() {
        super();
        this.randomOtp = customAlphabet('0123456789', 6);
    }
    public async generateOtp(userId: string, reason: OTPReason): Promise<Otp> {
        const otp = new Otp();
        otp.otp = this.randomOtp();
        otp.status = OTPStatus.ACTIVE,
        otp.reason = reason;
        otp.userId = userId;
        return this.save(otp);
    }
}
