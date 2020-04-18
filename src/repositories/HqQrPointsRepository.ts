import { EntityRepository, Repository } from 'typeorm';

import HqQrPointsFindRequest from '../api/request/HqQrPointsFindRequest';
import FindResponse from '../api/response/FindResponse';
import { HqQrPoints } from '../models/HqQrPoints';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(HqQrPoints)
export class HqQrPointsRepository extends Repository<HqQrPoints> implements AppFindRepository<HqQrPoints>  {
    public async findAll(findOptions?: HqQrPointsFindRequest): Promise<FindResponse<HqQrPoints>> {
        const queryBuilder = this.createQueryBuilder('hqQrPoints');
        queryBuilder.leftJoinAndSelect('hqQrPoints.qrPoint', 'qrPoint');
        queryBuilder.leftJoinAndSelect('qrPoint.product', 'product');
        queryBuilder.leftJoinAndSelect('qrPoint.attachment', 'attachment');
        queryBuilder.select();

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
    }

    public findList(findOptions?: HqQrPointsFindRequest): Promise<FindResponse<HqQrPoints>> {
        throw new Error('Method not implemented.');
    }
}
