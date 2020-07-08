import { validate } from 'class-validator';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import QrPointsFindRequest from '../api/request/QrPointsFindRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppNotFoundError, AppValidationError } from '../errors';
import { QrPointErrorCodes as ErrorCodes } from '../errors/codes';
import { Attachments } from '../models/Attachments';
import { ProductStatus } from '../models/Product';
import { QrPoints, QrPointsStatus } from '../models/QrPoints';
import { User } from '../models/User';
import { ProductRepository } from '../repositories/ProductRepository';
import { QrPointsRepository } from '../repositories/QrPointsRepository';
import { QRUtil } from '../utils/qr.util';
import { RendererUtil } from '../utils/renderer.util';
import { AppService } from './AppService';
import { AttachmentService } from './AttachmentService';

@Service()
export class QRService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        private attachmentService: AttachmentService,
        @OrmRepository() private qrPointsRepository: QrPointsRepository,
        @OrmRepository() private productRepository: ProductRepository
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

            const product = await this.productRepository.findOne({
                where: {
                    id: qr.productId,
                    status: ProductStatus.ACTIVE,
                },
            });

            if (!product) {
                throw new AppNotFoundError(
                    ErrorCodes.productNotFound.id,
                    ErrorCodes.productNotFound.msg,
                    { productId: qr.productId }
                );
            }

            this.log.info(`Creating ${qr.batchQuantity} new QR's.`);
            // Assign product points to the QR.
            qr.points = product.points;
            qr.createdById = loggedInUser.userId;
            qr.status = QrPointsStatus.ACTIVE;

            const qrs: QrPoints[] = [];
            for (let i = 0; i < qr.batchQuantity; i++) {
                const newQr = Object.assign(new QrPoints(), qr);
                newQr.id = nanoid(10);
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
            }, {
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

    public async downloadQrByBatch(batchId: string): Promise<Attachments> {
        try {
            const qrs = await this.qrPointsRepository.find({
                relations: ['attachment'],
                where: {
                    batchNumber: batchId,
                    status: QrPointsStatus.ACTIVE,
                },
            });

            if (!qrs || !qrs.length) {
                throw new AppNotFoundError(
                    ErrorCodes.noValidQrFound.id,
                    ErrorCodes.noValidQrFound.msg
                );
            }

            const attachments: Attachments[] = [];
            const qrIds: string[] = [];

            // Collect all the attachments related to QR's
            for (const qr of qrs) {
                if (qr.attachment) {
                    qrIds.push(qr.id);
                    attachments.push(qr.attachment);
                    continue;
                }

                const qrUtil = new QRUtil({});
                const path = await qrUtil.generateQR(qr.id);
                const attachment = await this.attachmentService.createAttachment({ path });
                // Store attachment details
                qrIds.push(qr.id);
                attachments.push(attachment);
                qr.attachment = attachment;
                await this.qrPointsRepository.save(qr);
            }

            const refinedAttachments = attachments.map((
                attachment: Attachments & { qrId?: string, batchNumber?: string },
                index: number
            ) => {
                attachment.fileLocation = join(__dirname, '../../', attachment.fileLocation);
                attachment.qrId = qrIds[index];
                attachment.batchNumber = batchId;
                return attachment;
            });

            const images = this.chunks(refinedAttachments, config.get('thresholds.maxImagesPerRow'));
            const pdfUtil = new RendererUtil();
            const pdfFilePath = await pdfUtil.generatePdf('qr-codes', images);
            return await this.attachmentService.createAttachment({ path: pdfFilePath });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.qrDownloadByBatchFailed.id,
                ErrorCodes.qrDownloadByBatchFailed.msg,
                { batchId }
            );
            error.log(this.log);
            throw error;
        }
    }

    private chunks(array: any[], size: number): any[] {
        const results = [];

        while (array.length) {
            results.push(array.splice(0, size));
        }
        return results;
    }
}
