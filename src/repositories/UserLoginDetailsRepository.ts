import { EntityRepository, Repository } from 'typeorm';

import { UserLoginDetails } from '../models/UserLoginDetails';

@EntityRepository(UserLoginDetails)
export class UserLoginDetailsRepository extends Repository<UserLoginDetails>  { }
