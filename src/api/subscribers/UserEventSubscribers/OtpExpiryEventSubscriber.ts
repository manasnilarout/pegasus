import { EventSubscriber, On } from 'event-dispatch';
import { getCustomRepository } from 'typeorm';

import { config } from '../../../config';
import { Otp, OTPStatus } from '../../../models/Otp';
import { OtpRepository } from '../../../repositories/OTPRepository';
import { events } from '../events';

@EventSubscriber()
export class OtpExpiryEventSubscriber {
    private otpRepository: OtpRepository;

    constructor() {
        this.otpRepository = getCustomRepository(OtpRepository);
    }

    @On(events.OTP.otpExpiry)
    public async onOtpExpiry(otp: Otp): Promise<void> {
        await this.wait(config.get('otp.otpExpiryTimeInMinutes'));
        const otpData = await this.otpRepository.findOne(otp.id);

        if (otpData.status === OTPStatus.USED) {
            return;
        }

        otpData.status = OTPStatus.EXPIRED;
        await this.otpRepository.save(otpData);
    }

    private wait(timeInMinutes: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, timeInMinutes * 60 * 1000));
    }
}
