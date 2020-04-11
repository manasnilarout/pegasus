import { EntityRepository, Repository } from 'typeorm';

import ChemistFindRequest from '../api/request/ChemistFindRequest';
import FindResponse from '../api/response/FindResponse';
import { Chemist } from '../models/Chemist';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(Chemist)
export class ChemistRepository extends Repository<Chemist> implements AppFindRepository<Chemist>  {
    public async findAll(findOptions?: ChemistFindRequest): Promise<FindResponse<Chemist>> {
        const queryBuilder = await this.createQueryBuilder('chemist');
        queryBuilder.leftJoinAndSelect('chemist.user', 'user');
        queryBuilder.leftJoinAndSelect('chemist.mr', 'mr');
        queryBuilder.leftJoinAndSelect('mr.user', 'mrUser');
        queryBuilder.leftJoinAndSelect('chemist.shopLicence', 'shopLicence');
        queryBuilder.leftJoinAndSelect('chemist.shopPhoto', 'shopPhoto');
        queryBuilder.leftJoinAndSelect('chemist.chemistSpeciality', 'chemistSpeciality');
        queryBuilder.leftJoinAndSelect('user.headQuarter', 'headQuarter');
        queryBuilder.leftJoinAndSelect('user.city', 'city');
        queryBuilder.leftJoinAndSelect('user.state', 'state');
        queryBuilder.select();

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit,
            findOptions.start);
    }

    public findList(findOptions?: ChemistFindRequest): Promise<FindResponse<Chemist>> {
        throw new Error('Method not implemented.');
    }
}
