import { Type } from 'class-transformer';

import { ChemistStatus } from '../../models/Chemist';
import { FindRequest, ModelProp } from './FindRequest';

export default class ChemistFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'chemist.createdOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('chemist.status')
    @Type(() => Number)
    public status: ChemistStatus;

    @ModelProp('chemist.id')
    public id: number;

    @ModelProp('user.userId')
    public userId: number;

    @ModelProp('mr.id')
    public mrId: number;

    @ModelProp('chemist.shopName')
    public shopName: number;

    @ModelProp('chemistSpeciality.name')
    public specialty: number;

    @ModelProp('user.stateId')
    public state: number;

    @ModelProp('user.headQuarterId')
    public headQuarter: number;

    @ModelProp('chemist.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;

    public getAllScannedProducts = 0;
}
