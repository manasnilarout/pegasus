import { EntityRepository, Repository } from 'typeorm';

import UserFindRequest from '../api/request/UserFindRequest';
import FindResponse from '../api/response/FindResponse';
import { User } from '../models/User';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(User)
export class UserRepository extends Repository<User> implements AppFindRepository<User>  {
    public async findAll(findOptions?: UserFindRequest): Promise<FindResponse<User>> {
        const queryBuilder = this.createQueryBuilder('user');
        queryBuilder.leftJoinAndSelect('user.state', 'state');
        queryBuilder.leftJoinAndSelect('user.city', 'city');
        queryBuilder.leftJoinAndSelect('user.headQuarter', 'headQuarter');
        queryBuilder.leftJoinAndSelect('user.chemist', 'chemist');
        queryBuilder.leftJoinAndSelect('user.mr', 'mr');
        queryBuilder.leftJoinAndSelect('mr.chemists', 'chemists');
        queryBuilder.select();

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
    }

    public findList(findOptions?: UserFindRequest): Promise<FindResponse<User>> {
        throw new Error('Method not implemented.');
    }
}
