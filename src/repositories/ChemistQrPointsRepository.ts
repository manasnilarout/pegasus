import { EntityRepository, Repository } from 'typeorm';

import ChemistQrPointFindRequest from '../api/request/ChemistQrPointFindRequest';
import FindResponse from '../api/response/FindResponse';
import { ChemistQrPoint } from '../models/ChemistQrPoint';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(ChemistQrPoint)
export class ChemistQrPointsRepository extends Repository<ChemistQrPoint> implements AppFindRepository<ChemistQrPoint>  {
    public async findAll(findOptions?: ChemistQrPointFindRequest): Promise<FindResponse<ChemistQrPoint>> {
        const queryBuilder = await this.createQueryBuilder('chemistQrPoint');
        queryBuilder.leftJoinAndSelect('chemistQrPoint.chemist', 'chemist');
        queryBuilder.leftJoinAndSelect('chemist.user', 'user');
        queryBuilder.leftJoinAndSelect('chemist.mr', 'mr');
        queryBuilder.leftJoinAndSelect('mr.user', 'mrUser');
        queryBuilder.leftJoinAndSelect('user.headQuarter', 'headQuarter');
        queryBuilder.leftJoinAndSelect('user.city', 'city');
        queryBuilder.leftJoinAndSelect('user.state', 'state');
        queryBuilder.leftJoinAndSelect('chemistQrPoint.chemistRedemptions', 'chemistRedemptions');
        queryBuilder.leftJoinAndSelect('chemistQrPoint.qr', 'qr');
        queryBuilder.leftJoinAndSelect('qr.product', 'product');
        queryBuilder.leftJoinAndSelect('qr.hqQrPoints', 'hqQrPoints');
        queryBuilder.select([
            'chemistQrPoint.id',
            'chemistQrPoint.qrId',
            'chemistQrPoint.chemistId',
            'chemistQrPoint.createdOn',
            'chemist.id',
            'chemist.shopName',
            'mr.id',
            'mrUser.userId',
            'mrUser.name',
            'qr.id',
            'qr.points',
            'qr.batchNumber',
            'product.id',
            'product.productName',
            'user.userId',
            'city.id',
            'city.name',
            'state.id',
            'state.name',
            'headQuarter.id',
            'headQuarter.name',
        ]);

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
    }

    public findList(findOptions?: ChemistQrPointFindRequest): Promise<FindResponse<ChemistQrPoint>> {
        throw new Error('Method not implemented.');
    }
}
