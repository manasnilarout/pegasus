import { validate } from 'class-validator';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { LoginCredentials } from '../api/http/requests/LoginCredentials';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import {
    AppBadRequestError, AppNotFoundError, AppUnauthorizedError, AppValidationError
} from '../errors';
import { UserErrorCodes as ErrorCodes } from '../errors/codes';
import { User, UserStatus } from '../models/User';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { UserTokens } from '../models/UserTokens';
import { UserLoginDetailsRepository } from '../repositories/UserLoginDetailsRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UserTokensRepository } from '../repositories/UserTokensRepository';
import { AppService } from './AppService';
import { AuthService } from './AuthService';

@Service()
export class UserService extends AppService {
    constructor(
        private authService: AuthService,
        @Logger(__filename, config.get('clsNamespace.name')) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private userLoginDetailsRepository: UserLoginDetailsRepository,
        @OrmRepository() private userTokensRepository: UserTokensRepository
    ) {
        super();
    }

    public async createMR(user: User, loggedInUser: User): Promise<User> {
        try {
            user.phone = user.phone.match(/\d/g) ? user.phone.match(/\d/g).join('') : '';

            if (!user.phone) {
                throw new AppBadRequestError(
                    ErrorCodes.userPhoneNumberMissing.id,
                    ErrorCodes.userPhoneNumberMissing.msg,
                    { user }
                );
            }

            const oldUser = await this.userRepository.findOne({
                where: {
                    phone: user.phone,
                    status: UserStatus.ACTIVE,
                },
            });

            if (oldUser) {
                throw new AppBadRequestError(
                    ErrorCodes.userExists.id,
                    ErrorCodes.userExists.msg,
                    { user }
                );
            }

            if (!user.userLoginDetails) {
                throw new AppBadRequestError(
                    ErrorCodes.userLoginDetails.id,
                    ErrorCodes.userLoginDetails.msg,
                    { user }
                );
            }

            // TODO: This need to be removed once below bug is fixed.
            // https://github.com/typeorm/typeorm/issues/4209
            user.userLoginDetails.password = await UserLoginDetails.encryptUserPassword(user.userLoginDetails.password);

            const errors = await validate(user);

            if (errors && errors.length) {
                throw new AppValidationError(
                    ErrorCodes.userValidationFailed.id,
                    ErrorCodes.userValidationFailed.msg,
                    { user, errors }
                );
            }

            if (loggedInUser) {
                user.createdBy = loggedInUser.userId;
            }

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

    public async loginUser(loginDetails: LoginCredentials): Promise<UserTokens> {
        try {
            const userLoginDetails = await this.userLoginDetailsRepository.findOne({
                relations: ['user'],
                where: {
                    username: loginDetails.username,
                },
            });

            if (!userLoginDetails) {
                throw new AppNotFoundError(
                    ErrorCodes.userNotFound.id,
                    ErrorCodes.userNotFound.msg,
                    { username: loginDetails.username }
                );
            }

            console.log(JSON.stringify(userLoginDetails));

            const match = await UserLoginDetails.comparePassword(userLoginDetails.password, loginDetails.password);

            if (!match) {
                throw new AppUnauthorizedError(
                    ErrorCodes.passwordNotMatched.id,
                    ErrorCodes.passwordNotMatched.msg
                );
            }

            const userToken = this.authService.generateToken(userLoginDetails.user);
            await this.userTokensRepository.insert(userToken);
            return userToken;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.loginFailed.id,
                ErrorCodes.loginFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }
}
