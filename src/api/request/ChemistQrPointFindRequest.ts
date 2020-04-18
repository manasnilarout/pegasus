import { Type } from 'class-transformer';

import { FindRequest, ModelProp } from './FindRequest';

export default class ChemistQrPointFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'chemistQrPoint.createdOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('chemistQrPoint.qrId')
    public qrId: string;

    @ModelProp('chemistQrPoint.chemistId')
    public chemistId: number;

    @ModelProp('chemistQrPoint.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;
}
