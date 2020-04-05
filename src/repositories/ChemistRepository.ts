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
        queryBuilder.leftJoinAndSelect('chemist.chemistMrs', 'chemistMrs');
        queryBuilder.leftJoinAndSelect('chemist.attachment', 'attachment');
        queryBuilder.leftJoinAndSelect('chemist.headQuarter', 'headQuarter');
        queryBuilder.leftJoinAndSelect('chemist.state', 'state');
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
