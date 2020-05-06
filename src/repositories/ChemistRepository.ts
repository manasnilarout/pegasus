import { EntityRepository, Repository } from 'typeorm';

import ChemistFindRequest from '../api/request/ChemistFindRequest';
import FindResponse from '../api/response/FindResponse';
import { Chemist } from '../models/Chemist';
import { HqQrPointStatus } from '../models/HqQrPoints';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(Chemist)
export class ChemistRepository extends Repository<Chemist> implements AppFindRepository<Chemist>  {
    public async findAll(findOptions?: ChemistFindRequest): Promise<FindResponse<Chemist>> {
        const queryBuilder = this.createQueryBuilder('chemist');
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
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
    }

    public findList(findOptions?: ChemistFindRequest): Promise<FindResponse<Chemist>> {
        throw new Error('Method not implemented.');
    }

    public async getChemistOrders(
        chemistId: number,
        duration?: { startDate: Date, endDate: Date }
    ): Promise<Chemist> {
        const qb = this.createQueryBuilder('chemist');

        if (duration) {
            qb.leftJoinAndSelect(
                'chemist.chemistQrPoints',
                'chemistQrPoints',
                'chemistQrPoints.createdOn BETWEEN :startDate AND :endDate',
                duration
            );
        } else {
            qb.leftJoinAndSelect('chemist.chemistQrPoints', 'chemistQrPoints');
        }

        qb.leftJoinAndSelect('chemistQrPoints.qr', 'qr');
        qb.leftJoinAndSelect(
            'qr.hqQrPoints',
            'hqQrPoints',
            'hqQrPoints.status = :hqQrStatus',
            { hqQrStatus: HqQrPointStatus.ACTIVE }
        );
        qb.leftJoinAndSelect('qr.product', 'product');

        qb.select([
            'chemist.id',
            'chemist.mrId',
            'chemist.points',
            'chemistQrPoints.id',
            'chemistQrPoints.createdOn',
            'qr.id',
            'qr.points',
            'product.id',
            'product.productName',
        ]);

        qb.where('chemist.id = :chemistId', { chemistId });
        return await qb.getOne();
    }

    public async getChemistClaims(
        chemistId: number,
        duration?: { startDate: Date, endDate: Date }
    ): Promise<Chemist> {
        const qb = this.createQueryBuilder('chemist');

        if (duration) {
            qb.leftJoinAndSelect(
                'chemist.chemistRedemptions',
                'chemistRedemptions',
                'chemistRedemptions.redeemedOn BETWEEN :startDate AND :endDate',
                duration
            );
        } else {
            qb.leftJoinAndSelect('chemist.chemistRedemptions', 'chemistRedemptions');
        }

        qb.select([
            'chemist.id',
            'chemist.mrId',
            'chemist.points',
            'chemistRedemptions.id',
            'chemistRedemptions.points',
            'chemistRedemptions.redeemedOn',
        ]);

        qb.where('chemist.id = :chemistId', { chemistId });
        return await qb.getOne();
    }
}
