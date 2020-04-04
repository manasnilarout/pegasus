import { EntityRepository, Repository } from 'typeorm';

import { UserTokens } from '../models/UserTokens';

@EntityRepository(UserTokens)
export class UserTokensRepository extends Repository<UserTokens>  { }
