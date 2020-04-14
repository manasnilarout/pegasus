import { EntityRepository, Repository } from 'typeorm';

import QrPointsFindRequest from '../api/request/QrPointsFindRequest';
import FindResponse from '../api/response/FindResponse';
import { QrPoints } from '../models/QrPoints';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(QrPoints)
export class QrPointsRepository extends Repository<QrPoints> implements AppFindRepository<QrPoints>  {
    public async findAll(findOptions?: QrPointsFindRequest): Promise<FindResponse<QrPoints>> {
        const queryBuilder = await this.createQueryBuilder('qrPoints');
        queryBuilder.leftJoinAndSelect('qrPoints.hqQrPoints', 'hqQrPoints');
        queryBuilder.leftJoinAndSelect('qrPoints.product', 'product');
        queryBuilder.leftJoinAndSelect('qrPoints.attachment', 'attachment');
        queryBuilder.select();

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit,
            findOptions.start);
    }

    public async insertMultiple(qrs: QrPoints[]): Promise<void> {
        await this.createQueryBuilder()
            .insert()
            .into(QrPoints)
            .values(qrs)
            .execute();
    }

    public findList(findOptions?: QrPointsFindRequest): Promise<FindResponse<QrPoints>> {
        throw new Error('Method not implemented.');
    }
}
