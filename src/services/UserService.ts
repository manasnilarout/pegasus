import { validate } from 'class-validator';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppNotFoundError, AppValidationError } from '../errors';
import { UserErrorCodes as ErrorCodes } from '../errors/codes';
import { MedicalRepresentative, MRStatus } from '../models/MedicalRepresentative';
import { User, UserStatus } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { AppService } from './AppService';

@Service()
export class UserService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository
    ) {
        super();
    }

    public async createMR(user: User): Promise<User> {
        try {
            const oldUser = await this.userRepository.findOne({
                where: {
                    username: user.username,
                    status: UserStatus.ACTIVE,
                },
            });

            if (oldUser) {
                throw new AppBadRequestError(
                    ErrorCodes.usernameExists.id,
                    ErrorCodes.usernameExists.msg,
                    { user }
                );
            }

            const errors = await validate(user);

            if (errors && errors.length) {
                throw new AppValidationError(
                    ErrorCodes.userValidationFailed.id,
                    ErrorCodes.userValidationFailed.msg,
                    { user, errors }
                );
            }

            user.medicalRepresentatives = [
                Object.assign(new MedicalRepresentative(), {
                    status: MRStatus.ACTIVE,
                    totalClaims: 0,
                    totalOrderAmount: 0,
                }),
            ];

            return await this.userRepository.save(user);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.userServiceError.id,
                ErrorCodes.userServiceError.msg,
                { user }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getUserById(userId: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                relations: ['medicalRepresentatives'],
                where: {
                    userId,
                    status: UserStatus.ACTIVE,
                },
            });

            if (!user) {
                throw new AppNotFoundError(
                    ErrorCodes.userNotFound.id,
                    ErrorCodes.userNotFound.msg,
                    { userId }
                );
            }

            return user;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.findingUserFailed.id,
                ErrorCodes.findingUserFailed.msg,
                { userId }
            );
            error.log(this.log);
            throw error;
        }
    }
}
