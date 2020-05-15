import { Type } from 'class-transformer';

import { FindRequest, ModelProp } from './FindRequest';

export default class QrPointsFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'qrPoints.createdOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('qrPoints.id')
    public qrId: string;

    @ModelProp('qrPoints.batchNumber')
    public batchNumber: number;

    @ModelProp('qrPoints.status')
    public status: number;

    @ModelProp('qrPoints.productId')
    public productId: number;

    @ModelProp('qrPoints.validFrom')
    @Type(() => Date)
    public validFrom: number;

    @ModelProp('qrPoints.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;

    public getRedeemedQrs: 0;
}
