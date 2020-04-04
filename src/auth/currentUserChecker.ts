import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export function currentUserChecker(connection: Connection): (action: Action) => Promise<User | undefined> {
    return async (action: Action): Promise<User | undefined> => {
        const userRepository = connection.getCustomRepository(UserRepository);
        const user = await userRepository.findOne({
            where: {
                userId: action.request.userId,
            },
        });
        return user;
    };
}
