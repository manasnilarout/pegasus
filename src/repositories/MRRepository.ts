import { EntityRepository, Repository } from 'typeorm';

import { ChemistStatus } from '../models/Chemist';
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
}
