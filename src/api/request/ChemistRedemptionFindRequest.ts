import { Type } from 'class-transformer';

import { FindRequest, ModelProp } from './FindRequest';

export default class ChemistRedemptionFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'chemistRedemption.redeemedOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('chemistRedemption.chemistId')
    public chemistId: string;

    @ModelProp('chemistRedemption.chemistQrPointId')
    public chemistQrPointId: number;

    @ModelProp('chemistRedemption.chemistQrPointId')
    public qrId: string;

    @ModelProp('chemistRedemption.redeemedOn', { sortable: true })
    @Type(() => Date)
    public redeemedOn: Date;
}
