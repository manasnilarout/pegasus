import { EntityRepository, Repository } from 'typeorm';

import ChemistRedemptionFindRequest from '../api/request/ChemistRedemptionFindRequest';
import FindResponse from '../api/response/FindResponse';
import { ChemistRedemptions } from '../models/ChemistRedemptions';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(ChemistRedemptions)
export class ChemistRedemptionRepository extends Repository<ChemistRedemptions> implements AppFindRepository<ChemistRedemptions>  {
    public async findAll(findOptions?: ChemistRedemptionFindRequest): Promise<FindResponse<ChemistRedemptions>> {
        const queryBuilder = this.createQueryBuilder('chemistRedemption');
        queryBuilder.leftJoinAndSelect('chemistRedemption.chemist', 'chemist');
        queryBuilder.leftJoinAndSelect('chemist.user', 'user');
        queryBuilder.leftJoinAndSelect('chemist.mr', 'mr');
        queryBuilder.leftJoinAndSelect('mr.user', 'mrUser');
        queryBuilder.leftJoinAndSelect('user.headQuarter', 'headQuarter');
        queryBuilder.leftJoinAndSelect('user.state', 'state');
        queryBuilder.leftJoinAndSelect('user.city', 'city');
        queryBuilder.leftJoinAndSelect('chemistRedemption.chemistQr', 'chemistQr');
        queryBuilder.leftJoinAndSelect('chemistQr.qr', 'qr');
        queryBuilder.leftJoinAndSelect('qr.hqQrPoints', 'hqQrPoints');
        queryBuilder.select([
            'chemistRedemption.id',
            'chemistRedemption.points',
            'chemistRedemption.redeemedOn',
            'chemistRedemption.initiatedById',
            'chemist.id',
            'chemist.shopName',
            'chemist.doctorName',
            'chemist.shopPhone',
            'chemist.points',
            'mr.id',
            'mrUser.userId',
            'mrUser.name',
            'user.userId',
            'user.name',
            'user.address',
            'headQuarter.id',
            'headQuarter.name',
            'state.id',
            'state.name',
            'city.id',
            'city.name',
        ]);

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
    }

    public findList(findOptions?: ChemistRedemptionFindRequest): Promise<FindResponse<ChemistRedemptions>> {
        throw new Error('Method not implemented.');
    }
}
