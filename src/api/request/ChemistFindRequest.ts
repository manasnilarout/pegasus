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

    @ModelProp('chemist.name')
    public name: number;

    @ModelProp('chemistSpeciality.name')
    public specialty: number;

    @ModelProp('chemist.stateId')
    public state: number;

    @ModelProp('chemist.headQuarterId')
    public headQuarter: number;

    @ModelProp('chemist.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;
}
