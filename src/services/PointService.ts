import { Service } from 'typedi';
import { In } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import ChemistQrPointFindRequest from '../api/request/ChemistQrPointFindRequest';
import ChemistRedemptionFindRequest from '../api/request/ChemistRedemptionFindRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppNotFoundError } from '../errors';
import { PointErrorCodes as ErrorCodes } from '../errors/codes';
import { Chemist, ChemistStatus } from '../models/Chemist';
import { ChemistQrPoint } from '../models/ChemistQrPoint';
import { ChemistRedemptions } from '../models/ChemistRedemptions';
import { QrPoints, QrPointsStatus } from '../models/QrPoints';
import { User } from '../models/User';
import { ChemistQrPointsRepository } from '../repositories/ChemistQrPointsRepository';
import { ChemistRedemptionRepository } from '../repositories/ChemistRedemptionRepository';
import { ChemistRepository } from '../repositories/ChemistRepository';
import { QrPointsRepository } from '../repositories/QrPointsRepository';
import { TransactionManager } from '../utils/TransactionManager';
import { AppService } from './AppService';

@Service()
export class PointService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private chemistQrPointsRepository: ChemistQrPointsRepository,
        @OrmRepository() private chemistRepository: ChemistRepository,
        @OrmRepository() private qrPointsRepository: QrPointsRepository,
        @OrmRepository() private chemistRedemptionRepository: ChemistRedemptionRepository
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

    public async redeemPoints(chemistId: string, points: number, loggedInUser: User): Promise<ChemistRedemptions> {
        try {
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
