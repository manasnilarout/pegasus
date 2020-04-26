import { validate } from 'class-validator';
import eventDispatcher from 'event-dispatch';
import { get } from 'request-promise';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { LoginCredentials } from '../api/http/requests/LoginCredentials';
import { ValidateLoginDetails } from '../api/http/requests/ValidateLoginDetails';
import UserFindRequest from '../api/request/UserFindRequest';
import FindResponse from '../api/response/FindResponse';
import { events } from '../api/subscribers/events';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import {
    AppBadRequestError, AppNotFoundError, AppRuntimeError, AppUnauthorizedError, AppValidationError
} from '../errors';
import { UserErrorCodes as ErrorCodes } from '../errors/codes';
import { Mr, MRStatus } from '../models/Mr';
import { Otp, OTPReason, OTPStatus } from '../models/Otp';
import { User, UserStatus, UserType } from '../models/User';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { UserTokens, UserTokenStatus } from '../models/UserTokens';
import { MrRepository } from '../repositories/MRRepository';
import { OtpRepository } from '../repositories/OTPRepository';
import { UserLoginDetailsRepository } from '../repositories/UserLoginDetailsRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UserTokensRepository } from '../repositories/UserTokensRepository';
import { RendererUtil } from '../utils/renderer.util';
import { AppService } from './AppService';
import { AuthService } from './AuthService';

@Service()
export class UserService extends AppService {
    public static async sendSmsToUser(phone: string, message: string): Promise<string> {
        try {
            const qs = {
                workingkey: env.fovea.sms.auth,
                to: phone,
                sender: env.fovea.sms.sender,
                message,
            };

            return await get(env.fovea.sms.endPoint, { qs });
        } catch (err) {
            throw new AppRuntimeError(
                ErrorCodes.errorSendingSMS.id,
                ErrorCodes.errorSendingSMS.msg,
                err
            );
        }
    }

    constructor(
        private authService: AuthService,
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private userLoginDetailsRepository: UserLoginDetailsRepository,
        @OrmRepository() private userTokensRepository: UserTokensRepository,
        @OrmRepository() private mrRepository: MrRepository,
        @OrmRepository() private otpRepository: OtpRepository
    ) {
        super();
    }

    public async createUser(user: User, loggedInUser: User): Promise<User> {
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

            if (user.designation === UserType.MR) {
                user.mr = new Mr();
                user.mr.status = MRStatus.ACTIVE;
            }

            this.log.debug(`Validating user.`);
            await this.validateUser(user);

            if (loggedInUser) {
                user.createdBy = loggedInUser.userId;
            }

            this.log.info('Storing new user.');
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

    public async getUsers(userFindRequest: UserFindRequest): Promise<FindResponse<User>> {
        return await this.fetchAll(this.userRepository, userFindRequest);
    }

    public async deactivateUser(userId: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                relations: ['mr'],
                where: { userId },
            });

            if (!user.mr) {
                throw new AppBadRequestError(
                    ErrorCodes.userNotMR.id,
                    ErrorCodes.userNotMR.msg,
                    { userId }
                );
            }

            // Deactivate MR details
            user.mr.status = MRStatus.INACTIVE;
            await this.mrRepository.save(user.mr);
            delete user.mr;

            if (!user) {
                this.userNotFoundError(userId);
            }

            user.status = UserStatus.INACTIVE;
            return await this.userRepository.save(user);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.userDeactivationFailed.id,
                ErrorCodes.userDeactivationFailed.msg,
                { userId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async logoutUser(userId: number): Promise<UserTokens[]> {
        try {
            const user = await this.userRepository.findOne({
                relations: ['userTokens'],
                where: {
                    userId,
                    status: UserStatus.ACTIVE,
                },
            });

            if (!user) {
                this.userNotFoundError(userId);
            }

            this.log.info(`Deactivating all device tokens for user #${userId}`);
            user.userTokens.forEach(token => token.status = UserTokenStatus.INACTIVE);
            return await this.userTokensRepository.save(user.userTokens);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.userLogoutFailed.id,
                ErrorCodes.userLogoutFailed.msg,
                { userId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async generateOtp(phoneNumber: string): Promise<Otp> {
        try {
            const phone = User.filterPhoneNumber(phoneNumber);
            const user = await this.userRepository.findOne({
                where: {
                    phone,
                    status: UserStatus.ACTIVE,
                },
            });

            if (!user) {
                this.userNotFoundError();
            }

            const otp = await this.otpRepository.generateOtp(user.userId, OTPReason.PASSWORD_RESET);
            eventDispatcher.dispatch(events.OTP.otpExpiry, otp);

            this.log.info(`Sending OTP to user, #${user.userId}`);
            const renderer = new RendererUtil();
            const message = await renderer.renderHTMLTemplate('forgot-password-otp', otp, 'sms');
            const response = await UserService.sendSmsToUser(user.phone, message);
            this.log.debug(`Message forwarded, response= "${response}"`);
            return otp;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.errorGeneratingOtp.id,
                ErrorCodes.errorGeneratingOtp.msg,
                { phoneNumber }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async validateUserLoginDetails(userId: number, validateLoginDetails: ValidateLoginDetails)
        : Promise<void> {
        try {
            const otp = await this.otpRepository.findOne({
                relations: ['user', 'user.userLoginDetails'],
                where: {
                    otp: validateLoginDetails.otp,
                    status: OTPStatus.ACTIVE,
                    reason: OTPReason.PASSWORD_RESET,
                    userId,
                },
            });

            if (!otp) {
                throw new AppUnauthorizedError(
                    ErrorCodes.receivedInvalidOtp.id,
                    ErrorCodes.receivedInvalidOtp.msg
                );
            }

            otp.user.userLoginDetails.password = await UserLoginDetails.encryptUserPassword(validateLoginDetails.password);
            await this.userLoginDetailsRepository.save(otp.user.userLoginDetails);
            otp.status = OTPStatus.USED;
            await this.otpRepository.save(otp);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.userLoginValidationFailed.id,
                ErrorCodes.userLoginValidationFailed.msg,
                validateLoginDetails
            );
            error.log(this.log);
            throw error;
        }
    }

    public async editUser(userId: number, user: User): Promise<User> {
        try {
            const existingUser = await this.userRepository.findOne({
                relations: ['userLoginDetails'],
                where: {
                    userId,
                    status: UserStatus.ACTIVE,
                },
            });

            if (!existingUser) {
                throw new AppBadRequestError(
                    ErrorCodes.userNotFound.id,
                    ErrorCodes.userNotFound.msg,
                    { userId, user }
                );
            }

            await this.validateUser(user);
            return await this.userRepository.save(user);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.userEditFailed.id,
                ErrorCodes.userEditFailed.msg,
                { userId, user }
            );
            error.log(this.log);
            throw error;
        }
    }

    private async validateUser(user: User): Promise<void> {
        const errors = await validate(user);

        if (errors && errors.length) {
            throw new AppValidationError(
                ErrorCodes.userValidationFailed.id,
                ErrorCodes.userValidationFailed.msg,
                { user, errors }
            );
        }
    }

    private userNotFoundError(userId?: number): void {
        throw new AppNotFoundError(
            ErrorCodes.userNotFound.id,
            ErrorCodes.userNotFound.msg,
            { userId }
        );
    }
}
