import eventDispatcher from 'event-dispatch';
import { Service } from 'typedi';
import { In, MoreThanOrEqual } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import ChemistQrPointFindRequest from '../api/request/ChemistQrPointFindRequest';
import ChemistRedemptionFindRequest from '../api/request/ChemistRedemptionFindRequest';
import FindResponse from '../api/response/FindResponse';
import { events } from '../api/subscribers/events';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppNotFoundError, AppUnauthorizedError } from '../errors';
import { PointErrorCodes as ErrorCodes } from '../errors/codes';
import { Chemist, ChemistStatus } from '../models/Chemist';
import { ChemistQrPoint } from '../models/ChemistQrPoint';
import { ChemistRedemptions } from '../models/ChemistRedemptions';
import { Otp, OTPReason, OTPStatus } from '../models/Otp';
import { QrPoints, QrPointsStatus } from '../models/QrPoints';
import { User } from '../models/User';
import { ChemistQrPointsRepository } from '../repositories/ChemistQrPointsRepository';
import { ChemistRedemptionRepository } from '../repositories/ChemistRedemptionRepository';
import { ChemistRepository } from '../repositories/ChemistRepository';
import { MrGiftOrdersRepository } from '../repositories/MrGiftOrdersRepository';
import { OtpRepository } from '../repositories/OTPRepository';
import { QrPointsRepository } from '../repositories/QrPointsRepository';
import { RendererUtil } from '../utils/renderer.util';
import { TransactionManager } from '../utils/TransactionManager';
import { AppService } from './AppService';
import { UserService } from './UserService';

@Service()
export class PointService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private chemistQrPointsRepository: ChemistQrPointsRepository,
        @OrmRepository() private chemistRepository: ChemistRepository,
        @OrmRepository() private qrPointsRepository: QrPointsRepository,
        @OrmRepository() private chemistRedemptionRepository: ChemistRedemptionRepository,
        @OrmRepository() private otpRepository: OtpRepository,
        @OrmRepository() private mrGiftOrdersRepository: MrGiftOrdersRepository
    ) {
        super();
    }

    public async getPoints(chemistQrPointFindRequest: ChemistQrPointFindRequest): Promise<FindResponse<ChemistQrPoint>> {
        return await this.fetchAll(this.chemistQrPointsRepository, chemistQrPointFindRequest);
    }

    public async getRedemptions(chemistRedemptionFindRequest: ChemistRedemptionFindRequest): Promise<FindResponse<ChemistRedemptions>> {
        return await this.fetchAll(this.chemistRedemptionRepository, chemistRedemptionFindRequest);
    }

    public async scanQr(chemistId: string, qrId: string, loggedInUser: User): Promise<ChemistQrPoint> {
        try {
            const chemistAndQr = await this.validateChemistAndQr(chemistId, qrId);

            return TransactionManager.run(async () => {
                this.log.info(`Updating QR(#${qrId}) status to 'used'.`);
                chemistAndQr.qr.status = QrPointsStatus.USED;
                await this.qrPointsRepository.save(chemistAndQr.qr);

                this.log.info(`Add points associated with QR to chemist points.`);
                chemistAndQr.chemist.points = chemistAndQr.chemist.points + chemistAndQr.qr.points;
                await this.chemistRepository.save(chemistAndQr.chemist);

                const chemistPoint = new ChemistQrPoint();
                chemistPoint.chemistId = chemistAndQr.chemist.id;
                this.log.debug(`Storing QR points for chemist with id "#${chemistId}"`);
                chemistPoint.qrId = chemistAndQr.qr.id;
                chemistPoint.createdById = loggedInUser.userId;
                return await this.chemistQrPointsRepository.save(chemistPoint);
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.scanQrFailed.id,
                ErrorCodes.scanQrFailed.msg,
                { chemistId, qrId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async redeemQr(chemistId: string, qrId: string, loggedInUser: User): Promise<ChemistRedemptions> {
        try {
            const chemistAndQr = await this.validateChemistAndQr(chemistId, qrId);

            if (![QrPointsStatus.ACTIVE, QrPointsStatus.ALLOTTED].includes(chemistAndQr.qr.status)) {
                throw new AppBadRequestError(
                    ErrorCodes.invalidQR.id,
                    ErrorCodes.invalidQR.msg,
                    { qrId }
                );
            }
            const chemistQrDetails = await this.chemistQrPointsRepository.findOne({
                where: {
                    chemist: chemistAndQr.chemist,
                    qr: chemistAndQr.qr,
                },
            });

            if (!chemistQrDetails) {
                throw new AppNotFoundError(
                    ErrorCodes.chemistQrAssociationNotFound.id,
                    ErrorCodes.chemistQrAssociationNotFound.msg,
                    { chemistId, qrId }
                );
            }

            // Make sure chemist has more than minimum points
            if (chemistAndQr.chemist.points < config.get('thresholds.chemistMinPoints')) {
                throw new AppBadRequestError(
                    ErrorCodes.insufficientPoints.id,
                    ErrorCodes.insufficientPoints.msg,
                    {
                        requestPoints: chemistAndQr.qr.points,
                        chemistPoints: chemistAndQr.chemist.points,
                        minimumRequiredPoints: config.get('thresholds.chemistMinPoints'),
                    }
                );
            }

            return TransactionManager.run(async () => {
                this.log.info(`Updating QR(#${qrId}) status to 'used'.`);
                chemistAndQr.qr.status = QrPointsStatus.USED;
                await this.qrPointsRepository.save(chemistAndQr.qr);

                this.log.info(`Deduct points associated with QR from chemist points.`);
                chemistAndQr.chemist.points = chemistAndQr.chemist.points - chemistAndQr.qr.points;
                await this.chemistRepository.save(chemistAndQr.chemist);

                const redemption = new ChemistRedemptions();
                redemption.chemist = chemistAndQr.chemist;
                this.log.debug(`Redeeming QR points for chemist with id "#${chemistId}"`);
                redemption.points = chemistAndQr.qr.points;
                redemption.chemistQr = chemistQrDetails;
                redemption.initiatedBy = loggedInUser;
                return await this.chemistRedemptionRepository.save(redemption);
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.redeemQrFailed.id,
                ErrorCodes.redeemQrFailed.msg,
                { chemistId, qrId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async otpForRedemption(chemistId: string): Promise<Otp> {
        try {
            const chemist = await this.chemistRepository.findOne({
                relations: ['user'],
                where: {
                    id: chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!chemist) {
                throw new AppNotFoundError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            const otp = await this.otpRepository.generateOtp(chemist.user.userId, OTPReason.REDEEM_POINTS);
            eventDispatcher.dispatch(events.OTP.otpExpiry, otp);

            this.log.info(`Sending OTP to user, #${chemist.user.userId}`);
            const renderer = new RendererUtil();
            const message = await renderer.renderHTMLTemplate('forgot-password-otp', otp, 'sms');
            const response = await UserService.sendSmsToUser(chemist.user.phone, message);
            this.log.debug(`Message forwarded, response = "${response}"`);
            return otp;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.otpGenerationFailed.id,
                ErrorCodes.otpGenerationFailed.msg,
                { chemistId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async redeemPoints(chemistId: string, points: number, otpString: string, loggedInUser: User)
        : Promise<ChemistRedemptions> {
        try {
            // Validate OTP for points redemption
            const otp = await this.otpRepository.findOne({
                relations: ['user', 'user.userLoginDetails'],
                where: {
                    otp: otpString,
                    status: OTPStatus.ACTIVE,
                    reason: OTPReason.REDEEM_POINTS,
                    chemistId,
                },
            });

            if (!otp) {
                throw new AppUnauthorizedError(
                    ErrorCodes.receivedInvalidOtp.id,
                    ErrorCodes.receivedInvalidOtp.msg
                );
            }

            points = points ? Number(points) : undefined;

            if (!points) {
                throw new AppBadRequestError(
                    ErrorCodes.invalidPoints.id,
                    ErrorCodes.invalidPoints.msg,
                    { points }
                );
            }

            const chemist = await this.chemistRepository.findOne({
                where: {
                    id: chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!chemist) {
                throw new AppNotFoundError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            // Make sure chemist has more than minimum points
            if (points > chemist.points || chemist.points < config.get('thresholds.chemistMinPoints')) {
                throw new AppBadRequestError(
                    ErrorCodes.insufficientPoints.id,
                    ErrorCodes.insufficientPoints.msg,
                    {
                        requestPoints: points,
                        chemistPoints: chemist.points,
                        minimumRequiredPoints: config.get('thresholds.chemistMinPoints'),
                    }
                );
            }

            return TransactionManager.run(async () => {
                this.log.info(`Adjusting chemist points.`);
                chemist.points = chemist.points - points;
                await this.chemistRepository.save(chemist);

                // Update OTP status
                otp.status = OTPStatus.USED;
                await this.otpRepository.save(otp);

                const redemption = new ChemistRedemptions();
                redemption.chemist = chemist;
                this.log.debug(`Redeeming QR points for chemist with id "#${chemistId}"`);
                redemption.points = points;
                redemption.initiatedBy = loggedInUser;
                return await this.chemistRedemptionRepository.save(redemption);
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.pointsRedemptionFailed.id,
                ErrorCodes.pointsRedemptionFailed.msg,
                { chemistId, points }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getDashboardPoints(durationInMonths: number): Promise<any> {
        try {
            const firstDateOfTheMonth: Date = new Date(new Date().setDate(1));

            if (durationInMonths !== 1) {
                const currentMonth = firstDateOfTheMonth.getMonth();
                firstDateOfTheMonth.setMonth(currentMonth - durationInMonths);
            }

            this.log.info(`Getting MR order details for ${durationInMonths} month(s).`);
            const orders = await this.mrGiftOrdersRepository.find({
                select: ['receivedGifts', 'dispatchedGifts', 'mr'],
                where: {
                    createdOn: MoreThanOrEqual(firstDateOfTheMonth),
                },
            });

            let totalOrders = 0;
            let totalMrOrders = 0;

            orders.forEach(order => {
                totalOrders += order.receivedGifts;
                totalMrOrders += order.dispatchedGifts;
            });

            this.log.info('Getting chemist(s) info.');
            const activeChemists = await this.chemistRepository.find({
                select: ['id'],
                where: { status: ChemistStatus.ACTIVE },
            });
            const activeChemistCount = activeChemists.length;

            const chemistRedemptions = await this.chemistRedemptionRepository.find({
                select: ['chemistId', 'points'],
                where: { redeemedOn: MoreThanOrEqual(firstDateOfTheMonth) },
            });

            let totalRedeemedPoints = 0;
            chemistRedemptions.forEach(chemistRedemption => {
                totalRedeemedPoints += chemistRedemption.points;
            });
            const totalRedemptionCount = chemistRedemptions.length;

            return { totalOrders, totalMrOrders, activeChemistCount, totalRedeemedPoints, totalRedemptionCount };
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.calculatingDashboardRecordsFailed.id,
                ErrorCodes.calculatingDashboardRecordsFailed.msg,
                { durationInMonths }
            );
            error.log(this.log);
            throw error;
        }
    }

    private async validateChemistAndQr(chemistId: string, qrId: string)
        : Promise<{ chemist: Chemist, qr: QrPoints }> {
        try {
            const chemist = await this.chemistRepository.findOne({
                where: {
                    id: chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!chemist) {
                throw new AppNotFoundError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            const qr = await this.qrPointsRepository.findOne({
                relations: ['hqQrPoints'],
                where: {
                    id: qrId,
                    status: In([QrPointsStatus.ACTIVE, QrPointsStatus.ALLOTTED]),
                },
            });

            if (!qr) {
                throw new AppNotFoundError(
                    ErrorCodes.qrNotFound.id,
                    ErrorCodes.qrNotFound.msg,
                    { qrId }
                );
            }

            return { chemist, qr };
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.chemistQrValidationFailed.id,
                ErrorCodes.chemistQrValidationFailed.msg,
                { chemistId, qrId }
            );
            error.log(this.log);
            throw error;
        }
    }
}
