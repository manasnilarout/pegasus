import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import ChemistFindRequest from '../api/request/ChemistFindRequest';
import { ChemistRequest } from '../api/request/ChemistRequest';
import { File } from '../api/request/FileRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError } from '../errors';
import { ChemistErrorCodes as ErrorCodes } from '../errors/codes';
import { AttachmentStatus } from '../models/Attachments';
import { Chemist, ChemistStatus } from '../models/Chemist';
import { User, UserStatus, UserType } from '../models/User';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { AttachmentsRepository } from '../repositories/AttachmentsRepository';
import { ChemistRepository } from '../repositories/ChemistRepository';
import { UserRepository } from '../repositories/UserRepository';
import { TransactionManager } from '../utils/TransactionManager';
import { AppService } from './AppService';
import { AttachmentService } from './AttachmentService';
import { UserService } from './UserService';

@Service()
export class ChemistService extends AppService {
    public static calculateDates(differenceInMonths: number): { startDate: Date, endDate: Date } {
        const JS_DATE_DIFF = 1;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (differenceInMonths - JS_DATE_DIFF));
        startDate.setDate(startDate.getDate() - (startDate.getDate() - JS_DATE_DIFF));
        return { startDate, endDate };
    }
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        private attachmentService: AttachmentService,
        private userService: UserService,
        @OrmRepository() private chemistRepository: ChemistRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private attachmentsRepository: AttachmentsRepository
    ) {
        super();
    }

    public async createChemist(
        chemist: ChemistRequest,
        shopPhoto: File,
        shopLicence: File,
        loggedInUser: User
    ): Promise<Chemist> {
        try {
            const userObj = this.mapToUser(chemist, loggedInUser);

            return TransactionManager.run(async () => {
                const newChemist = new Chemist();
                newChemist.shopPhoto = await this.attachmentService.createAttachment(shopPhoto);
                newChemist.shopLicence = await this.attachmentService.createAttachment(shopLicence);
                newChemist.user = await this.userService.createUser(userObj, loggedInUser);
                this.log.debug('User stored and ready for use.');
                newChemist.shopPhone = chemist.shopPhone;
                newChemist.doctorName = chemist.doctorName;
                newChemist.mrId = chemist.mr;
                newChemist.speciality = chemist.specialty;
                newChemist.status = ChemistStatus.ACTIVE;

                return await this.chemistRepository.save(newChemist);
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.chemistCreationFailed.id,
                ErrorCodes.chemistCreationFailed.msg,
                { chemist, shopPhoto, shopLicence }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getChemists(productFindRequest: ChemistFindRequest): Promise<FindResponse<Chemist>> {
        return await this.fetchAll(this.chemistRepository, productFindRequest);
    }

    public async deleteChemist(chemistId: number): Promise<Chemist> {
        try {
            const chemist = await this.chemistRepository.findOne({
                relations: ['user'],
                where: {
                    chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!chemist) {
                throw new AppBadRequestError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            this.log.info(`Deleting chemist with id #${chemistId}`);
            return await TransactionManager.run(async () => {
                chemist.user.status = UserStatus.INACTIVE;
                await this.userRepository.save(chemist.user);

                chemist.status = ChemistStatus.INACTIVE;
                return await this.chemistRepository.save(chemist);
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.chemistDeletionFailed.id,
                ErrorCodes.chemistDeletionFailed.msg,
                { chemistId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async updateChemist(
        chemistId: number,
        chemist: ChemistRequest,
        shopPhoto: File,
        shopLicence: File
    ): Promise<Chemist> {
        try {
            const existingChemist = await this.chemistRepository.findOne({
                relations: ['shopPhoto', 'shopLicence'],
                where: {
                    chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!existingChemist) {
                throw new AppBadRequestError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            return await TransactionManager.run(async () => {
                if (shopPhoto) {
                    // Inactivate old shop photo
                    const attachment = existingChemist.shopPhoto;
                    this.log.info(`Deactivating old shop photo. (#${attachment.id})`);
                    attachment.status = AttachmentStatus.INACTIVE;
                    // TODO: Move attachment from assets directory to tmp directory.
                    await this.attachmentsRepository.save(attachment);

                    // Insert new shop photo
                    const newAttachment = await this.attachmentService.createAttachment(shopPhoto);
                    existingChemist.shopPhoto = newAttachment;
                }

                if (shopLicence) {
                    // Inactivate old shop licence
                    const attachment = existingChemist.shopLicence;
                    this.log.info(`Deactivating old shop licence. (#${attachment.id})`);
                    attachment.status = AttachmentStatus.INACTIVE;
                    await this.attachmentsRepository.save(attachment);

                    // Insert new shop licence
                    const newAttachment = await this.attachmentService.createAttachment(shopLicence);
                    existingChemist.shopLicence = newAttachment;
                }

                existingChemist.shopPhone = chemist.shopPhone || existingChemist.shopPhone;
                existingChemist.doctorName = chemist.doctorName || existingChemist.doctorName;
                existingChemist.mrId = chemist.mr || existingChemist.mrId;
                existingChemist.speciality = chemist.specialty || existingChemist.speciality;

                return await this.chemistRepository.save(existingChemist);
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.chemistDeletionFailed.id,
                ErrorCodes.chemistDeletionFailed.msg,
                { chemist }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getChemistOrders(chemistId: number, periodInMonths?: number): Promise<Chemist> {
        try {
            const chemist = await this.chemistRepository.findOne({
                where: {
                    id: chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!chemist) {
                throw new AppBadRequestError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            let chemistOrderDetails: any;

            if (periodInMonths) {
                this.log.debug(`Orders for last ${periodInMonths} months to be calculated.`);
                const calculatedDates = ChemistService.calculateDates(Number(periodInMonths));
                chemistOrderDetails = await this.chemistRepository.getChemistOrders(chemistId, calculatedDates);
            } else {
                chemistOrderDetails = await this.chemistRepository.getChemistOrders(chemistId);
            }

            chemistOrderDetails.orders = chemistOrderDetails.chemistQrPoints.map(chemistQrPoint => {
                return {
                    qrId: chemistQrPoint.qr.id,
                    productName: chemistQrPoint.qr.product.productName,
                    productId: chemistQrPoint.qr.product.id,
                    points: (chemistQrPoint.qr.hqQrPoints && chemistQrPoint.qr.hqQrPoints.length)
                        ? chemistQrPoint.qr.hqQrPoints[0].hqQrPoints : chemistQrPoint.qr.points,
                    orderedOn: chemistQrPoint.createdOn,
                };
            });

            delete chemistOrderDetails.chemistQrPoints;
            return chemistOrderDetails;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingChemistOrdersFailed.id,
                ErrorCodes.fetchingChemistOrdersFailed.msg,
                { chemistId, periodInMonths }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getChemistClaims(chemistId: number, periodInMonths?: number): Promise<Chemist> {
        try {
            const chemist = await this.chemistRepository.findOne({
                where: {
                    id: chemistId,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (!chemist) {
                throw new AppBadRequestError(
                    ErrorCodes.chemistNotFound.id,
                    ErrorCodes.chemistNotFound.msg,
                    { chemistId }
                );
            }

            if (periodInMonths) {
                this.log.debug(`Claims for last ${periodInMonths} months to be calculated.`);
                const calculatedDates = ChemistService.calculateDates(Number(periodInMonths));
                return await this.chemistRepository.getChemistClaims(chemistId, calculatedDates);
            }

            return await this.chemistRepository.getChemistClaims(chemistId);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingChemistClaimsFailed.id,
                ErrorCodes.fetchingChemistClaimsFailed.msg,
                { chemistId, periodInMonths }
            );
            error.log(this.log);
            throw error;
        }
    }

    private mapToUser(chemistRequest: ChemistRequest, loggedInUser: User): User {
        const user = new User();
        user.name = chemistRequest.name;
        user.phone = chemistRequest.mobileNo;
        user.email = chemistRequest.email;
        user.designation = UserType.CHEMIST;
        user.headQuarterId = chemistRequest.headQuarter;
        user.cityId = chemistRequest.city;
        user.stateId = chemistRequest.state;
        user.address = chemistRequest.address;
        user.createdBy = loggedInUser.userId;
        user.userLoginDetails = new UserLoginDetails();
        user.userLoginDetails.username = chemistRequest.email;
        user.userLoginDetails.password = chemistRequest.password || chemistRequest.mobileNo;
        return user;
    }
}
