import { EntityRepository, Repository } from 'typeorm';

import QrPointsFindRequest from '../api/request/QrPointsFindRequest';
import FindResponse from '../api/response/FindResponse';
import { QrPoints } from '../models/QrPoints';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(QrPoints)
export class QrPointsRepository extends Repository<QrPoints> implements AppFindRepository<QrPoints>  {
    public async findAll(findOptions?: QrPointsFindRequest): Promise<FindResponse<QrPoints>> {
        const queryBuilder = this.createQueryBuilder('qrPoints');

        if (!findOptions.getRedeemedQrs) {
            queryBuilder.leftJoinAndSelect('qrPoints.hqQrPoints', 'hqQrPoints');
            queryBuilder.leftJoinAndSelect('qrPoints.product', 'product');
            queryBuilder.leftJoinAndSelect('qrPoints.attachment', 'attachment');
            queryBuilder.select();
        } else {
            queryBuilder.leftJoinAndSelect('qrPoints.product', 'product');
            queryBuilder.leftJoinAndSelect('qrPoints.chemistQrPoints', 'chemistQrPoints');
            queryBuilder.leftJoinAndSelect('chemistQrPoints.chemist', 'chemist');
            queryBuilder.leftJoinAndSelect('chemistQrPoints.chemistRedemptions', 'chemistRedemptions');
            queryBuilder.select([
                'qrPoints.id',
                'qrPoints.batchNumber',
                'qrPoints.batchQuantity',
                'qrPoints.createdOn',
                'qrPoints.status',
                'product.id',
                'product.productName',
                'chemistQrPoints.id',
                'chemistQrPoints.createdOn',
                'chemist.id',
                'chemist.shopName',
                'chemistRedemptions.id',
                'chemistRedemptions.points',
                'chemistRedemptions.redeemedOn',
                'chemistRedemptions.initiatedById',
            ]);
        }

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
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
