import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import HqQrPointsFindRequest from '../api/request/HqQrPointsFindRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppNotFoundError } from '../errors';
import { HqQrPointErrorCodes as ErrorCodes } from '../errors/codes';
import { HqQrPoints, HqQrPointStatus } from '../models/HqQrPoints';
import { QrPointsStatus } from '../models/QrPoints';
import { User } from '../models/User';
import { HqQrPointsRepository } from '../repositories/HqQrPointsRepository';
import { QrPointsRepository } from '../repositories/QrPointsRepository';
import { AppService } from './AppService';

@Service()
export class HqQrService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private hqQrPointsRepository: HqQrPointsRepository,
        @OrmRepository() private qrPointsRepository: QrPointsRepository
    ) {
        super();
    }

    public async createHqQr(
        hqQr: HqQrPoints & { brandId: number },
        loggedInUser: User
    ): Promise<HqQrPoints | HqQrPoints[]> {
        try {

            if (hqQr.brandId) {
                const brandQrs = await this.qrPointsRepository.find({
                    where: {
                        productId: hqQr.brandId,
                        status: QrPointsStatus.ACTIVE,
                    },
                });

                if (!brandQrs || !brandQrs.length) {
                    throw new AppBadRequestError(
                        ErrorCodes.noActiveQrs.id,
                        ErrorCodes.noActiveQrs.msg,
                        { hqQr }
                    );
                }

                const newHqQrs: HqQrPoints[] = [];

                for (const qr of brandQrs) {
                    console.log(qr.id);
                    const newHqQr = Object.assign(new HqQrPoints(), {
                        hqId: hqQr.hqId,
                        hqQrPoints: hqQr.hqQrPoints,
                        qrPointId: qr.id,
                        status: HqQrPointStatus.ACTIVE,
                        createdById: loggedInUser.userId,
                    });

                    newHqQrs.push(newHqQr);
                }

                return await this.hqQrPointsRepository.save(newHqQrs);
            }

            const oldHqQr = await this.hqQrPointsRepository.findOne({
                where: {
                    qrPointId: hqQr.qrPointId,
                },
            });

            if (oldHqQr) {
                throw new AppBadRequestError(
                    ErrorCodes.hqQrAlreadyExists.id,
                    ErrorCodes.hqQrAlreadyExists.msg,
                    { hqQr }
                );
            }

            // Validate QR ID
            await this.validateQrId(hqQr.qrPointId);

            this.log.debug('Creating HQ QR.');
            hqQr.status = HqQrPointStatus.ACTIVE;
            hqQr.createdById = loggedInUser.userId;
            return await this.hqQrPointsRepository.save(hqQr);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.hqQrCreationFailed.id,
                ErrorCodes.hqQrCreationFailed.msg,
                { hqQr }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async editHhqQr(hqQrId: number, hqQr: HqQrPoints): Promise<HqQrPoints> {
        try {
            const hqQrDetails = await this.hqQrPointsRepository.findOne({
                where: {
                    id: hqQrId,
                    status: HqQrPointStatus.ACTIVE,
                },
            });

            if (!hqQrDetails) {
                throw new AppNotFoundError(
                    ErrorCodes.hqQrNotFound.id,
                    ErrorCodes.hqQrNotFound.msg,
                    { hqQrId }
                );
            }

            if (hqQr.hqId && hqQr.hqId !== hqQrDetails.hqId) {
                this.log.info('Verifying HQ and QR id uniqueness.');
                const duplicateHqQr = await this.hqQrPointsRepository.findOne({
                    where: {
                        hqId: hqQr.hqId,
                        qrPointId: hqQrDetails.qrPointId,
                        status: HqQrPointStatus.ACTIVE,
                    },
                });

                if (duplicateHqQr) {
                    throw new AppBadRequestError(
                        ErrorCodes.hqAndQrCombinationAlreadyPresent.id,
                        ErrorCodes.hqAndQrCombinationAlreadyPresent.msg,
                        { hqQr }
                    );
                }
            }

            // Validate QR ID
            if (hqQr.qrPointId && hqQr.qrPointId !== hqQrDetails.qrPointId) {
                await this.validateQrId(hqQr.qrPointId);
            }

            Object.assign(hqQrDetails, hqQr);
            return await this.hqQrPointsRepository.save(hqQrDetails);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.hqQrEditFailed.id,
                ErrorCodes.hqQrEditFailed.msg,
                { hqQr }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getHqQrs(productFindRequest: HqQrPointsFindRequest): Promise<FindResponse<HqQrPoints>> {
        return await this.fetchAll(this.hqQrPointsRepository, productFindRequest);
    }

    public async deleteHqQr(hqQrId: number): Promise<HqQrPoints> {
        try {
            const hqQr = await this.hqQrPointsRepository.findOne({
                where: {
                    id: hqQrId,
                    status: HqQrPointStatus.ACTIVE,
                },
            });

            if (!hqQr) {
                throw new AppNotFoundError(
                    ErrorCodes.hqQrNotFound.id,
                    ErrorCodes.hqQrNotFound.msg,
                    { hqQrId }
                );
            }

            hqQr.status = HqQrPointStatus.INACTIVE;
            return await this.hqQrPointsRepository.save(hqQr);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.hqQrDeletionFailed.id,
                ErrorCodes.hqQrDeletionFailed.msg,
                { hqQrId }
            );
            error.log(this.log);
            throw error;
        }
    }

    private async validateQrId(qrId: string): Promise<void> {
        try {
            this.log.info(`Validating QR ID. (#${qrId})`);
            const qrPoint = await this.qrPointsRepository.findOne({
                id: qrId,
                status: QrPointsStatus.ACTIVE,
            });

            if (!qrPoint) {
                throw new AppBadRequestError(
                    ErrorCodes.noValidQrFound.id,
                    ErrorCodes.noValidQrFound.msg,
                    { qrId }
                );
            }
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.qrValidationFailed.id,
                ErrorCodes.qrValidationFailed.msg,
                { qrId }
            );
            error.log(this.log);
            throw error;
        }
    }
}
