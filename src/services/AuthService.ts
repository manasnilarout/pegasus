import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { v4 } from 'uuid';

import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppUnauthorizedError } from '../errors';
import { AuthErrorCodes as ErrorCodes } from '../errors/codes';
import { User } from '../models/User';
import { UserTokens, UserTokenStatus } from '../models/UserTokens';
import { UserTokensRepository } from '../repositories/UserTokensRepository';
import { AppService } from './AppService';

export interface RoleModules { [moduleID: number]: Partial<Permissions>; }

interface Permissions {
    readAll: boolean;
    readOwn: boolean;
    writeOwn: boolean;
    writeAll: boolean;
}

@Service()
export class AuthService extends AppService {

    public static getTokenFromHeader(authCode: string): string | undefined {

        if (!authCode) {
            throw new AppUnauthorizedError(
                ErrorCodes.authorizationHeaderNotFound.id,
                ErrorCodes.authorizationHeaderNotFound.msg
            );
        }

        return authCode.match(/BEARER\s(.*)/i) ?
            authCode.match(/BEARER\s(.*)/i)[1] : undefined;
    }

    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private userTokensRepository: UserTokensRepository
    ) {
        super();
    }
    public generateToken(user: User): UserTokens {
        return Object.assign(new UserTokens(), {
            token: v4(),
            userId: user.userId,
        });
    }

    public async getUserTokenDetails(token: string): Promise<UserTokens> {
        try {
            const userToken = await this.userTokensRepository.findOne({
                where: {
                    token,
                    status: UserTokenStatus.ACTIVE,
                },
            });

            if (!userToken) {
                throw new AppUnauthorizedError(
                    ErrorCodes.userLoggedOut.id,
                    ErrorCodes.userLoggedOut.msg,
                    { token }
                );
            }

            return userToken;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingTokenFailed.id,
                ErrorCodes.fetchingTokenFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }
}
