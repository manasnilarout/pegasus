import { validate } from 'class-validator';
import { Service } from 'typedi';
import { In } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import ChemistFindRequest from '../api/request/ChemistFindRequest';
import { File } from '../api/request/FileRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppValidationError } from '../errors';
import { ChemistErrorCodes as ErrorCodes } from '../errors/codes';
import { AttachmentStatus } from '../models/Attachments';
import { Chemist, ChemistStatus } from '../models/Chemist';
import { ChemistMrs, ChemistMRStatus } from '../models/ChemistMrs';
import { User, UserStatus, UserType } from '../models/User';
import { AttachmentsRepository } from '../repositories/AttachmentsRepository';
import { ChemistMrsRepository } from '../repositories/ChemistMRsRepository';
import { ChemistRepository } from '../repositories/ChemistRepository';
import { UserRepository } from '../repositories/UserRepository';
import { TransactionManager } from '../utils/TransactionManager';
import { AppService } from './AppService';
import { AttachmentService } from './AttachmentService';

@Service()
export class ChemistService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        private attachmentService: AttachmentService,
        @OrmRepository() private chemistRepository: ChemistRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private attachmentsRepository: AttachmentsRepository,
        @OrmRepository() private chemistMrsRepository: ChemistMrsRepository
    ) {
        super();
    }

    public async createChemist(chemist: Chemist, fileDetails: File, loggedInUser: User): Promise<Chemist> {
        try {
            const oldChemist = await this.chemistRepository.findOne({
                where: {
                    name: chemist.name,
                    status: ChemistStatus.ACTIVE,
                },
            });

            if (oldChemist) {
                throw new AppBadRequestError(
                    ErrorCodes.chemistAlreadyExists.id,
                    ErrorCodes.chemistAlreadyExists.msg,
                    { chemist }
                );
            }

            const mrs = await this.validateMRs(JSON.parse(chemist.mrIds));
            chemist.chemistMrs = mrs.map(mr => Object.assign(new ChemistMrs(), {
                mr,
                status: ChemistMRStatus.ACTIVE,
            }));

            const attachment = await this.attachmentService.createAttachment(fileDetails);
            chemist.attachment = attachment;

            const errors = await validate(chemist);

            if (errors && errors.length) {
                throw new AppValidationError(
                    ErrorCodes.chemistValidationFailed.id,
                    ErrorCodes.chemistValidationFailed.msg,
                    { chemist }
                );
            }

            chemist.createdBy = loggedInUser;
            return await this.chemistRepository.save(chemist);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.chemistCreationFailed.id,
                ErrorCodes.chemistCreationFailed.msg,
                { chemist, fileDetails }
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

            chemist.status = ChemistStatus.INACTIVE;
            return await this.chemistRepository.save(chemist);
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

    public async updateChemist(chemistId: number, chemist: Chemist, fileDetails: File): Promise<Chemist> {
        try {
            const existingChemist = await this.chemistRepository.findOne({
                relations: ['attachment', 'chemistMrs'],
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
                if (fileDetails) {
                    // Inactivate old attachment
                    const attachment = existingChemist.attachment;
                    this.log.info(`Deactivating old attachment. (#${attachment.id})`);
                    attachment.status = AttachmentStatus.INACTIVE;
                    // TODO: Move attachment from assets directory to tmp directory.
                    await this.attachmentsRepository.save(attachment);

                    // Insert new attachment
                    const newAttachment = await this.attachmentService.createAttachment(fileDetails);
                    existingChemist.attachment = newAttachment;
                }

                if (chemist.mrIds && JSON.parse(chemist.mrIds).length) {
                    // Deactivate old mr's
                    this.log.info('Deactivating old MR\'s and adding new ones.');
                    await this.chemistMrsRepository.remove(existingChemist.chemistMrs);

                    const mrs = await this.validateMRs(JSON.parse(chemist.mrIds));
                    existingChemist.chemistMrs = mrs.map(mr => Object.assign(new ChemistMrs(), {
                        mr,
                        chemistId,
                        status: ChemistMRStatus.ACTIVE,
                    }));
                }

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

    private async validateMRs(mrIds: string[]): Promise<User[]> {
        try {
            this.log.info('Validating MR\'s.');
            const MRs = await this.userRepository.find({
                where: {
                    userId: In(mrIds),
                    designation: UserType.MR,
                    status: UserStatus.ACTIVE,
                },
            });

            const userIds = MRs.map(user => user.userId.toString());
            mrIds = mrIds.map(val => val.toString());
            const missingMrs = this.compareArrays(mrIds, userIds);

            if (missingMrs && missingMrs.length) {
                throw new AppBadRequestError(
                    ErrorCodes.MRsNotFound.id,
                    ErrorCodes.MRsNotFound.msg,
                    { missingMrIds: missingMrs }
                );
            }

            return MRs;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.MRValidationFailed.id,
                ErrorCodes.MRValidationFailed.msg,
                { mrIds }
            );
            error.log(this.log);
            throw error;
        }
    }
}
