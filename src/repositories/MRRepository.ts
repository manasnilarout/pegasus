import { EntityRepository, Repository } from 'typeorm';

import { ChemistStatus } from '../models/Chemist';
import { HqQrPointStatus } from '../models/HqQrPoints';
import { Mr, MRStatus } from '../models/Mr';

@EntityRepository(Mr)
export class MrRepository extends Repository<Mr>  {
    public async getMrChemistDetails(mrId: number): Promise<Mr> {
        const qb = this.createQueryBuilder('mr');
        qb.leftJoinAndSelect('mr.chemists', 'chemists', 'chemists.status = :chemistStatus', { chemistStatus: ChemistStatus.ACTIVE });
        qb.leftJoinAndSelect('chemists.user', 'user');
        qb.leftJoinAndSelect('user.headQuarter', 'headQuarter');
        qb.leftJoinAndSelect('user.state', 'state');
        qb.leftJoinAndSelect('user.city', 'city');
        qb.select([
            'mr.id',
            'mr.userId',
            'chemists.id',
            'chemists.points',
            'chemists.shopName',
            'chemists.shopPhone',
            'user.userId',
            'user.name',
            'user.phone',
            'user.address',
            'city.id',
            'city.name',
            'state.id',
            'state.name',
            'headQuarter.id',
            'headQuarter.name',
        ]);

        qb.where('mr.id = :mrId', { mrId });
        qb.andWhere('mr.status = :status', { status: MRStatus.ACTIVE });

        return await qb.getOne();
    }

    public async getMrChemistOrders(
        mrId: number,
        duration?: { startDate: Date, endDate: Date }
    ): Promise<Mr> {
        const qb = this.createQueryBuilder('mr');
        qb.leftJoinAndSelect(
            'mr.chemists',
            'chemists',
            'chemists.status = :chemistStatus',
            { chemistStatus: ChemistStatus.ACTIVE }
        );

        if (duration) {
            qb.leftJoinAndSelect(
                'chemists.chemistQrPoints',
                'chemistQrPoints',
                'chemistQrPoints.createdOn BETWEEN :startDate AND :endDate',
                duration
            );
        } else {
            qb.leftJoinAndSelect('chemists.chemistQrPoints', 'chemistQrPoints');
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
            'mr.id',
            'chemists.id',
            'chemists.mrId',
            'chemists.points',
            'chemists.shopName',
            'chemistQrPoints.id',
            'chemistQrPoints.createdOn',
            'qr.id',
            'qr.points',
            'product.id',
            'product.productName',
        ]);

        qb.where('mr.id = :mrId', { mrId });
        return await qb.getOne();
    }

    public async getMrChemistClaims(
        mrId: number,
        duration?: { startDate: Date, endDate: Date }
    ): Promise<Mr> {
        const qb = this.createQueryBuilder('mr');
        qb.leftJoinAndSelect(
            'mr.chemists',
            'chemists',
            'chemists.status = :chemistStatus',
            { chemistStatus: ChemistStatus.ACTIVE }
        );

        if (duration) {
            qb.leftJoinAndSelect(
                'chemists.chemistRedemptions',
                'chemistRedemptions',
                'chemistRedemptions.redeemedOn BETWEEN :startDate AND :endDate',
                duration
            );
        } else {
            qb.leftJoinAndSelect('chemists.chemistRedemptions', 'chemistRedemptions');
        }

        qb.select([
            'mr.id',
            'chemists.id',
            'chemists.mrId',
            'chemists.points',
            'chemists.shopName',
            'chemistRedemptions.id',
            'chemistRedemptions.points',
            'chemistRedemptions.redeemedOn',
        ]);

        qb.where('mr.id = :mrId', { mrId });
        return await qb.getOne();
    }
}
