import { validate } from 'class-validator';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { File } from '../api/request/FileRequest';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppValidationError } from '../errors';
import { ChemistErrorCodes as ErrorCodes } from '../errors/codes';
import { Chemist } from '../models/Chemist';
import { User } from '../models/User';
import { ChemistRepository } from '../repositories/ChemistRepository';
import { AppService } from './AppService';

@Service()
export class ChemistService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private chemistRepository: ChemistRepository
    ) {
        super();
    }

    public async createChemist(chemist: Chemist, fileDetails: File, loggedInUser: User): Promise<Chemist> {
        try {
            const oldChemist = await this.chemistRepository.findOne({
                where: {
                    name: chemist.name,
                },
            });

            if (oldChemist) {
                throw new AppBadRequestError(
                    ErrorCodes.chemistAlreadyExists.id,
                    ErrorCodes.chemistAlreadyExists.msg,
                    { chemist }
                );
            }

            /**
             * TODO:
             * 1. Store the attachment in tmp directory.
             * 2. Move the attachment to assets directory.
             * 3. Make sure hosting is proper from assets directory.
             * 4. Add attachment_url column to the attachment table and verify.
             */

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
}
