import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { AuthService, RoleModules } from '../services/AuthService';

export function authorizationChecker(connection?: Connection)
    : (action: Action, moduleDetails?: RoleModules[]) => Promise<boolean> | boolean {
    const authService = Container.get<AuthService>(AuthService);

    return async (action: Action, moduleDetails?: RoleModules[]): Promise<boolean> => {
        const userToken: string = AuthService.getTokenFromHeader(action.request.headers.authorization);

        // Check if token is present in redis
        const userTokenDetails = await authService.getUserTokenDetails(userToken);

        action.request.userId = userTokenDetails.userId;
        return true;
    };
}
