import { validate } from 'class-validator';
import { Attachments } from 'src/models/Attachments';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { v4 } from 'uuid';

import QrPointsFindRequest from '../api/request/QrPointsFindRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppNotFoundError, AppValidationError } from '../errors';
import { QrPointErrorCodes as ErrorCodes } from '../errors/codes';
import { QrPoints, QrPointsStatus } from '../models/QrPoints';
import { User } from '../models/User';
import { QrPointsRepository } from '../repositories/QrPointsRepository';
import { QRUtil } from '../utils/qr.util';
import { AppService } from './AppService';
import { AttachmentService } from './AttachmentService';

@Service()
export class QRService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        private attachmentService: AttachmentService,
        @OrmRepository() private qrPointsRepository: QrPointsRepository
    ) {
        super();
    }

    public async createQrs(qr: QrPoints, loggedInUser: User): Promise<QrPoints[]> {
        try {
            const oldQr = await this.qrPointsRepository.findOne({
                where: {
                    batchNumber: qr.batchNumber,
                },
            });

            if (oldQr) {
                throw new AppBadRequestError(
                    ErrorCodes.qrWithBatchNumberExists.id,
                    ErrorCodes.qrWithBatchNumberExists.msg,
                    { qr }
                );
            }

            this.log.info(`Creating ${qr.batchQuantity} new QR's.`);
            qr.createdById = loggedInUser.userId;
            qr.status = QrPointsStatus.ACTIVE;

            const qrs: QrPoints[] = [];
            for (let i = 0; i < qr.batchQuantity; i++) {
                const newQr = Object.assign(new QrPoints(), qr);
                newQr.id = v4();
                qrs.push(newQr);
            }

            const errors = await validate(qrs);

            if (errors && errors.length) {
                throw new AppValidationError(
                    ErrorCodes.qrValidationFailed.id,
                    ErrorCodes.qrValidationFailed.msg,
                    { qr }
                );
            }

            await this.qrPointsRepository.insertMultiple(qrs);
            return qrs;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.qrCreationFailed.id,
                ErrorCodes.qrCreationFailed.msg,
                { qr }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getQrs(productFindRequest: QrPointsFindRequest): Promise<FindResponse<QrPoints>> {
        return await this.fetchAll(this.qrPointsRepository, productFindRequest);
    }

    public async editQr(batchNumber: string, batchQuantity: number, qr: QrPoints): Promise<QrPoints[]> {
        try {
            const qrs = await this.qrPointsRepository.find({
                batchNumber,
                batchQuantity,
                status: QrPointsStatus.ACTIVE,
            });

            if (!qrs || !qrs.length) {
                throw new AppNotFoundError(
                    ErrorCodes.qrsNotFound.id,
                    ErrorCodes.qrsNotFound.msg,
                    { batchNumber, batchQuantity, qr }
                );
            }

            if (qr.batchQuantity !== qrs[0].batchQuantity) {
                throw new AppBadRequestError(
                    ErrorCodes.updatingBatchQuantityNotAllowed.id,
                    ErrorCodes.updatingBatchQuantityNotAllowed.msg,
                    { batchNumber, batchQuantity, qr }
                );
            }

            qrs.forEach(qrPoint => {
                qrPoint = Object.assign(qrPoint, qr);
            });

            await this.qrPointsRepository.update({
                batchNumber,
                batchQuantity,
            },  {
                batchNumber: qr.batchNumber || qrs[0].batchNumber,
                validFrom: qr.validFrom || qrs[0].validFrom,
                validTill: qr.validTill || qrs[0].validTill,
                status: qr.status || qrs[0].status,
            });

            return qrs;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.qrEditFailed.id,
                ErrorCodes.qrEditFailed.msg,
                { batchNumber, batchQuantity, qr }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async downloadQr(id: string): Promise<Attachments> {
        try {
            const qr = await this.qrPointsRepository.findOne({
                relations: ['attachment'],
                where: {
                    id,
                    status: QrPointsStatus.ACTIVE,
                },
            });

            if (!qr) {
                throw new AppNotFoundError(
                    ErrorCodes.noValidQrFound.id,
                    ErrorCodes.noValidQrFound.msg
                );
            }

            if (qr.attachment) {
                return qr.attachment;
            }

            this.log.info('Associated QR not found so generating a new one.');
            const qrUtil = new QRUtil({});
            const path = await qrUtil.generateQR(qr.id);
            const attachment = await this.attachmentService.createAttachment({ path });
            // Store attachment details
            qr.attachment = attachment;
            await this.qrPointsRepository.save(qr);
            return attachment;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.qrDownloadFailed.id,
                ErrorCodes.qrDownloadFailed.msg,
                { id }
            );
            error.log(this.log);
            throw error;
        }
    }
}
